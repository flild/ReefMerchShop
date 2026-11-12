// Adversarial audit probes. Uses an in-memory database and intercepts upload writes.
// Does not start a web server, read .env, or open project databases.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { createClient } = require('@libsql/client');
const { drizzle } = require('drizzle-orm/libsql');
const { getTableConfig } = require('drizzle-orm/sqlite-core');

const root = path.resolve(__dirname, '..');
const writes = [];
const cache = new Map();
let token;
let cookieOptions;
let authReads = 0;
let db;
let auditClient;
const environment = { JWT_SECRET: require('node:crypto').randomBytes(48).toString('hex') };
const fakeFs = {
  mkdir: async () => {},
  writeFile: async (destination, data) => writes.push({ destination, data: Buffer.from(data) }),
  unlink: async () => {},
  readFile: async (destination) => { const found = writes.find(w => w.destination === destination); if (!found) throw new Error('ENOENT'); return found.data; },
};

function load(relative) {
  const absolute = path.resolve(root, relative);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const module = { exports: {} };
  cache.set(absolute, module);
  const code = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    }, fileName: absolute,
  }).outputText;
  const localRequire = (name) => {
    if (name === '@/db') return { db, client: auditClient };
    if (name === '@/lib/auth') return new Proxy(load('src/lib/auth.ts'), { get: (target, key) => typeof target[key] === 'function' ? (...args) => { authReads++; return target[key](...args); } : target[key] });
    if (name === 'next/cache') return { revalidatePath: () => {} };
    if (name === 'next/navigation') return {
      redirect: (url) => { throw new Error(`AUDIT_REDIRECT:${url}`); },
      notFound: () => { throw new Error('AUDIT_NOT_FOUND'); },
    };
    if (name === 'next/headers') return { cookies: async () => ({
      get: () => token ? { value: token } : undefined,
      set: (_name, value, options) => { token = value; cookieOptions = options; },
      delete: () => { token = undefined; },
    }) };
    if (name === 'fs/promises' || name === 'node:fs/promises') return fakeFs;
    if (name === 'next/link' || name === 'next/image') return { __esModule: true, default: () => null };
    if (name.startsWith('@/components/')) return new Proxy({}, {
      get: (_target, key) => {
        const component = () => null;
        component.displayName = String(key);
        return component;
      },
    });
    if (name.startsWith('@/')) {
      const base = name.replace('@/', 'src/');
      return load(fs.existsSync(path.join(root, `${base}.ts`)) ? `${base}.ts` : `${base}.tsx`);
    }
    return require(name);
  };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`, {
    Buffer, crypto: globalThis.crypto, File: globalThis.File, FormData: globalThis.FormData,
    TextEncoder, Request, Response, process: { env: environment, cwd: () => root }, console,
  }, { filename: absolute })(localRequire, module, module.exports);
  return module.exports;
}

function form(fields) {
  const result = new FormData();
  for (const [key, value] of Object.entries(fields)) result.set(key, value);
  return result;
}

function findElement(node, displayName) {
  if (!node || typeof node !== 'object') return null;
  if (node.type?.displayName === displayName) return node;
  const children = node.props?.children;
  for (const child of Array.isArray(children) ? children : [children]) {
    if (Array.isArray(child)) {
      for (const entry of child) { const found = findElement(entry, displayName); if (found) return found; }
    } else { const found = findElement(child, displayName); if (found) return found; }
  }
  return null;
}

async function initialize(url = ':memory:') {
  auditClient = createClient({ url });
  for (const file of ['0000_sharp_christian_walker.sql', '0002_cool_korvac.sql']) {
    for (const statement of fs.readFileSync(path.join(root, 'drizzle', file), 'utf8').split('--> statement-breakpoint')) {
      if (statement.trim()) await auditClient.execute(statement);
    }
  }
  const schema = load('src/db/schema.ts');
  for (const entity of Object.values(schema)) {
    let config; try { config = getTableConfig(entity); } catch { continue; }
    const existing = (await auditClient.execute('PRAGMA table_info("' + config.name + '")')).rows.map(r => r.name);
    if (!existing.length) continue;
    for (const column of config.columns) if (!existing.includes(column.name)) await auditClient.execute('ALTER TABLE "'+config.name+'" ADD COLUMN "'+column.name+'" '+column.getSQLType());
  }
  await auditClient.execute('PRAGMA foreign_keys = ON');
  db = drizzle(auditClient, { schema });
  return { db, schema, client: auditClient };
}
module.exports = { load, initialize, form, findElement, writes, environment,
  token: () => token, setToken: value => { token = value; }, cookieOptions: () => cookieOptions,
  guardCalls: () => authReads,
};
