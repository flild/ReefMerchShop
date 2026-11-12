// Runs the production build on localhost against a disposable database.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { SignJWT } = require('jose');
const h = require('./probes.cjs');

async function main() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'reef-security-'));
  const { db, schema, client } = await h.initialize('file:' + path.join(directory, 'fixture.db').replaceAll('\\', '/'));
  let server;
  try {
    const ids = Object.fromEntries(['admin', 'manager', 'maker', 'client'].map(role => [role, crypto.randomUUID()]));
    for (const [role, id] of Object.entries(ids)) await db.insert(schema.users).values({
      id, role, name: 'Audit ' + role, email: role + '@example.invalid', passwordHash: 'AUDIT_HASH_MUST_NOT_BE_SENT',
    });
    const orderId = crypto.randomUUID(), collectId = crypto.randomUUID();
    await db.insert(schema.orders).values({ id: orderId, orderNumber: 'AUDIT', userId: ids.client, total: 17891 });
    await db.insert(schema.collects).values({ id: collectId, title: 'Audit', description: 'Audit', minCount: 10, deadline: new Date(), productionDate: 'Audit', currentSum: 17891 });
    await db.insert(schema.collectParticipants).values({ id: crypto.randomUUID(), collectId, nickname: 'Audit', email: 'audit@example.invalid', quantity: 10, totalPrice: 17891 });
    await db.insert(schema.articles).values({ id: crypto.randomUUID(), slug: 'audit-draft', title: 'AUDIT_PRIVATE_DRAFT', contentMd: 'AUDIT_PRIVATE_BODY', isPublished: false });
    const listener = net.createServer();
    listener.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    const port = listener.address().port;
    await new Promise(resolve => listener.close(resolve));
    const origin = `http://127.0.0.1:${port}`;
    let output = '';
    server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
      cwd: path.resolve(__dirname, '..'),
      env: { ...process.env, NODE_ENV: 'production', APP_URL: origin, DATABASE_URL: 'file:' + path.join(directory, 'fixture.db').replaceAll('\\', '/'), JWT_SECRET: h.environment.JWT_SECRET },
      stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true,
    });
    server.stdout.on('data', chunk => { output += chunk; });
    server.stderr.on('data', chunk => { output += chunk; });
    let ready = false;
    for (let n = 0; n < 100; n++) {
      if (server.exitCode !== null) throw new Error('Server exited: ' + output);
      try { if ((await fetch(origin + '/login')).ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.ok(ready, 'Server did not start: ' + output);
    const tokens = {};
    for (const [role, id] of Object.entries(ids)) tokens[role] = await h.load('src/lib/session-token.ts').signSession({ userId: id, role });
    const checks = [];
    const request = async (url, role) => {
      const response = await fetch(origin + url, { redirect: 'manual', headers: role ? { cookie: `session=${tokens[role]}` } : {} });
      return { response, body: await response.text() };
    };
    let result = await request('/admin/orders');
    assert.equal(result.response.status, 307);
    assert.equal(new URL(result.response.headers.get('location')).pathname, '/login');
    checks.push('Anonymous admin access redirects to login');
    result = await request('/admin/orders/new', 'manager');
    assert.equal(result.response.status, 200);
    assert.ok(!result.body.includes('AUDIT_HASH_MUST_NOT_BE_SENT'));
    assert.equal(result.response.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(result.response.headers.get('x-frame-options'), 'DENY');
    checks.push('Manager order form omits password hashes; security headers are present');
    result = await request('/admin/collects/' + collectId, 'maker');
    assert.equal(result.response.status, 200);
    assert.ok(!result.body.includes('17891'));
    checks.push('Maker HTML and RSC payload omit participant prices');
    for (const url of ['/content/articles', '/admin/content/articles']) {
      result = await request(url);
      assert.equal(result.response.status, 307);
      assert.ok(!result.body.includes('AUDIT_PRIVATE'));
    }
    result = await request('/admin/content/articles', 'maker');
    assert.equal(result.response.status, 307);
    assert.ok(!result.body.includes('AUDIT_PRIVATE'));
    result = await request('/admin/content/articles', 'manager');
    assert.equal(result.response.status, 200);
    assert.ok(result.body.includes('AUDIT_PRIVATE_DRAFT'));
    checks.push('Drafts are available to managers and hidden from guests and makers on both route families');
    result = await request('/uploads/proofs/legacy.jpg', 'admin');
    assert.equal(result.response.status, 404);
    checks.push('Legacy public proof URLs are blocked');
    const forged = await new SignJWT({ userId: ids.admin, role: 'admin' }).setProtectedHeader({ alg: 'HS256' })
      .setIssuer('reef').setAudience('reef').setIssuedAt().setExpirationTime('7d').sign(new TextEncoder().encode('super_secret_dev_key_123'));
    tokens.forged = forged;
    result = await request('/admin/users', 'forged');
    assert.equal(result.response.status, 307);
    assert.ok(!result.body.includes('AUDIT_HASH'));
    checks.push('JWT signed with the old default key is rejected over HTTP');
    for (const check of checks) console.log('PASS HTTP: ' + check);
    fs.writeFileSync(path.join(__dirname, 'http-results.json'), JSON.stringify({ passed: checks.length, checks, boundary: 'Local production build; generated JWTs; disposable fixture database; no deployed server tested.' }, null, 2) + '\n');
  } finally {
    if (server && server.exitCode === null) { const exited = once(server, 'exit'); server.kill(); await exited; }
    client.close();
    if (path.dirname(path.resolve(directory)) !== path.resolve(os.tmpdir()) || !path.basename(directory).startsWith('reef-security-')) throw new Error('Unsafe cleanup path');
    fs.rmSync(directory, { recursive: true, force: true });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
