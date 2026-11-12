const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const sharp = require('sharp');
const { eq } = require('drizzle-orm');
const { SignJWT } = require('jose');
const h = require('./probes.cjs');
const passed = [];
async function test(name, run) { await run(); passed.push(name); console.log(`PASS: ${name}`); }
async function denied(run) {
  const before = h.guardCalls();
  let result;
  try { result = await run(); } catch (error) { assert.match(error.message, /Недостаточно прав/); }
  assert.ok(h.guardCalls() > before, 'Operation did not run an authorization guard');
  assert.notEqual(result?.success, true);
}

async function main() {
  // libsql may reopen its connection after a transaction; :memory: would lose
  // its schema in that case. A disposable file exercises real transactions.
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'reef-security-regression-'));
  const { db, schema, client } = await h.initialize('file:' + path.join(directory, 'fixture.db').replaceAll('\\', '/'));
  try {
    const actor = crypto.randomUUID(), orderId = crypto.randomUUID();
    await db.insert(schema.users).values({ id: actor, name: 'Audit actor', email: 'audit@example.invalid', passwordHash: 'AUDIT_ONLY_HASH', role: 'admin' });
    await db.insert(schema.orders).values({ id: orderId, orderNumber: 'AUDIT', userId: actor, total: 17891 });
    const auth = h.load('src/lib/auth.ts');
    const signIn = async (role) => {
      await db.update(schema.users).set({ role }).where(eq(schema.users.id, actor));
      await auth.createSession(actor, role);
    };
    await test('Default key, missing secret, nonexistent user, and unknown roles are rejected', async () => {
      h.setToken(await new SignJWT({ userId: actor, role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setExpirationTime('7d').sign(new TextEncoder().encode('super_secret_dev_key_123')));
      assert.equal(await auth.getSession(), null);
      const secret = h.environment.JWT_SECRET;
      delete h.environment.JWT_SECRET;
      await assert.rejects(() => auth.createSession(actor, 'admin'), /JWT_SECRET/);
      h.environment.JWT_SECRET = secret;
      await auth.createSession(crypto.randomUUID(), 'admin');
      assert.equal(await auth.getSession(), null);
      await assert.rejects(() => auth.createSession(actor, 'owner'));
    });
    await test('Production cookies require Secure even without APP_URL', async () => {
      h.environment.NODE_ENV = 'production';
      await signIn('admin');
      assert.equal(h.cookieOptions().secure, true);
      assert.equal(h.cookieOptions().httpOnly, true);
    });
    const actions = {
      orders: h.load('src/actions/admin/orders.ts'), portfolio: h.load('src/actions/admin/portfolio.ts'),
      articles: h.load('src/actions/admin/articles.ts'), categories: h.load('src/actions/admin/categories.ts'),
      checklist: h.load('src/actions/admin/checklist.ts'), checklists: h.load('src/actions/admin/checklists.ts'),
      proofs: h.load('src/actions/admin/proofs.ts'), collects: h.load('src/actions/admin/collects.ts'),
      users: h.load('src/actions/admin/users.ts'),
    };
    const restricted = [
      () => actions.orders.createOrderItem(new FormData()),
      () => actions.orders.deleteOrderItem(crypto.randomUUID(), orderId),
      () => actions.portfolio.createPortfolioItem(new FormData()),
      () => actions.portfolio.updatePortfolioItem(crypto.randomUUID(), new FormData()),
      () => actions.portfolio.deletePortfolioItem(crypto.randomUUID()),
      () => actions.articles.createArticle(null, new FormData()),
      () => actions.articles.updateArticle(crypto.randomUUID(), null, new FormData()),
      () => actions.articles.deleteArticle(crypto.randomUUID()),
      () => actions.articles.toggleArticlePublish(crypto.randomUUID(), false),
      () => actions.articles.uploadArticleImage(new FormData()),
      () => actions.categories.createCategory(new FormData()),
      () => actions.categories.updateCategory(crypto.randomUUID(), new FormData()),
      () => actions.categories.deleteCategory(crypto.randomUUID()),
      () => actions.checklist.createRule(null, new FormData()),
      () => actions.checklist.deleteRule(crypto.randomUUID()),
      () => actions.checklist.toggleRuleStatus(crypto.randomUUID(), false),
      () => actions.checklists.createChecklistTemplate({ title: 'Audit', description: '' }),
      () => actions.checklists.updateChecklistTemplate(crypto.randomUUID(), {}),
      () => actions.checklists.deleteChecklistTemplate(crypto.randomUUID()),
      () => actions.checklists.createChecklistBlock(crypto.randomUUID(), {}),
      () => actions.checklists.updateChecklistBlock(crypto.randomUUID(), crypto.randomUUID(), {}),
      () => actions.checklists.deleteChecklistBlock(crypto.randomUUID(), crypto.randomUUID()),
      () => actions.collects.updateParticipantData(crypto.randomUUID(), crypto.randomUUID(), {}),
    ];
    for (const role of [null, 'client', 'maker']) {
      await test(`Restricted administrative mutations reject ${role ?? 'anonymous'} callers before validation`, async () => {
        if (role) await signIn(role); else h.setToken(undefined);
        for (const run of restricted) await denied(run);
        if (role !== 'maker') {
          await denied(() => actions.orders.updateOrderStatus(orderId, 'completed'));
          await denied(() => actions.orders.uploadOrderProof(new FormData()));
          await denied(() => actions.proofs.addOrderProof(orderId, new FormData()));
        }
      });
    }
    await test('Manager cannot manage users; current database role overrides old JWT; deleted users lose access', async () => {
      await signIn('manager');
      const result = await actions.users.createUser(null, h.form({ name: 'Blocked', email: 'blocked@example.invalid', password: 'Audit-password', role: 'admin' }));
      assert.equal(result.success, false);
      await signIn('admin');
      await db.update(schema.users).set({ role: 'client' }).where(eq(schema.users.id, actor));
      assert.equal((await auth.getSession()).role, 'client');
      assert.equal((await actions.users.createUser(null, h.form({ name: 'Blocked', email: 'blocked@example.invalid', password: 'Audit-password', role: 'admin' }))).success, false);
      const deleted = crypto.randomUUID();
      await db.insert(schema.users).values({ id: deleted, name: 'Deleted', email: 'deleted@example.invalid', passwordHash: 'hash', role: 'admin' });
      await auth.createSession(deleted, 'admin');
      await db.delete(schema.users).where(eq(schema.users.id, deleted));
      assert.equal(await auth.getSession(), null);
    });
    await test('Authorized order changes work; arbitrary statuses do not', async () => {
      await signIn('manager');
      assert.equal((await actions.orders.updateOrderStatus(orderId, 'INVALID')).success, false);
      assert.equal((await actions.orders.updateOrderStatus(orderId, 'production')).success, true);
      assert.equal((await actions.orders.createOrderItem(h.form({ orderId, name: 'Audit', productType: 'acrylic', quantity: '10', price: '123' }))).success, true);
      const [item] = await db.select().from(schema.orderItems);
      assert.equal((await actions.orders.deleteOrderItem(item.id, crypto.randomUUID())).success, true);
      assert.equal((await db.select().from(schema.orderItems)).length, 1);
    });
    await test('Order form exposes only id, name, email; maker dashboard is blocked', async () => {
      await signIn('manager');
      const page = await h.load('src/app/admin/orders/new/page.tsx').default();
      for (const user of h.findElement(page, 'OrderForm').props.users) assert.deepEqual(Object.keys(user).sort(), ['email', 'id', 'name']);
      await signIn('maker');
      await assert.rejects(() => h.load('src/app/admin/page.tsx').default(), /AUDIT_REDIRECT/);
    });
    await test('Article editors reject anonymous, client and maker users before reading drafts', async () => {
      for (const role of [null, 'client', 'maker']) {
        if (role) await signIn(role); else h.setToken(undefined);
        for (const [file, args] of [
          ['src/app/admin/content/articles/page.tsx', undefined],
          ['src/app/admin/content/articles/[id]/page.tsx', { params: Promise.resolve({ id: crypto.randomUUID() }) }],
          ['src/app/admin/content/articles/new/page.tsx', undefined],
        ]) await denied(() => h.load(file).default(args));
      }
    });
    const collectId = crypto.randomUUID(), participantId = crypto.randomUUID();
    await db.insert(schema.collects).values({ id: collectId, title: 'Audit', description: 'Audit', minCount: 10, deadline: new Date(), productionDate: 'Audit' });
    await db.insert(schema.collectParticipants).values({ id: participantId, collectId, nickname: 'Audit', email: 'audit@example.invalid', quantity: 10, totalPrice: 17891 });
    await test('Maker receives no price and cannot set payment states or change participant details', async () => {
      await signIn('maker');
      const page = await h.load('src/app/admin/collects/[id]/page.tsx').default({ params: Promise.resolve({ id: collectId }) });
      const row = h.findElement(page, 'ParticipantTableRow');
      assert.equal(row.props.canViewFinances, false);
      assert.equal(row.props.participant.totalPrice, null);
      assert.ok((await actions.collects.updateParticipantStatus(participantId, 'paid', collectId)).error);
      assert.equal((await actions.collects.updateParticipantStatus(participantId, 'approved', collectId)).success, true);
    });
    await test('HTML/SVG, forged image MIME, oversized files are rejected; valid rasters are re-encoded with safe names', async () => {
      const uploads = h.load('src/lib/uploads.ts');
      for (const file of [new File(['<script></script>'], 'a.html'), new File(['<svg/>'], 'a.svg'), new File(['<html/>'], 'a.jpg', { type: 'image/jpeg' }), new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'large.jpg')]) {
        await assert.rejects(() => uploads.saveImage(file, 'portfolio'));
      }
      const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'white' } }).png().toBuffer();
      const saved = await uploads.saveImage(new File([bytes], '../../bad.html'), 'portfolio');
      assert.match(saved.path, /^\/uploads\/portfolio\/[a-f0-9-]{36}\.jpg$/);
      assert.equal(h.writes.at(-1).data[0], 0xff);
    });
    await test('Proofs are stored outside public and served only to staff or the order owner', async () => {
      await signIn('manager');
      const [item] = await db.select().from(schema.orderItems);
      const bytes = await sharp({ create: { width: 2, height: 2, channels: 3, background: 'white' } }).png().toBuffer();
      const uploaded = await actions.orders.uploadOrderProof(h.form({ orderId, orderItemId: item.id, file: new File([bytes], 'proof.png') }));
      assert.equal(uploaded.success, true, JSON.stringify(uploaded));
      const [file] = await db.select().from(schema.files);
      assert.match(file.path, /^private:proofs\//);
      assert.ok(!h.writes.at(-1).destination.includes(path.join('public', 'uploads')));
      const route = h.load('src/app/files/[id]/route.ts');
      const get = () => route.GET(new Request('http://localhost/files/' + file.id), { params: Promise.resolve({ id: file.id }) });
      assert.equal((await get()).status, 200);
      await signIn('client');
      assert.equal((await get()).status, 200);
      await db.update(schema.orders).set({ userId: null }).where(eq(schema.orders.id, orderId));
      assert.equal((await get()).status, 404);
      h.setToken(undefined);
      assert.equal((await get()).status, 401);
    });
    await test('Rate-limit quota is atomic and expires in SQLite', async () => {
      const { consumeRateLimit } = h.load('src/lib/rate-limit.ts');
      const values = await Promise.all(Array.from({ length: 8 }, () => consumeRateLimit('audit', 'same', 2)));
      assert.equal(values.filter(Boolean).length, 2);
      await client.execute('UPDATE security_rate_limits SET expires_at = 0');
      assert.equal(await consumeRateLimit('audit', 'same', 2), true);
    });
    await test('Registration fixes the client role; login validates input and throttles repeated passwords', async () => {
      h.setToken(undefined);
      const actions = h.load('src/actions/auth.ts');
      const email = 'registered@example.invalid';
      const fields = { name: 'Registered audit', email, password: 'Audit-password-123', confirmPassword: 'Audit-password-123', role: 'admin' };
      await assert.rejects(() => actions.register(null, h.form(fields)), /AUDIT_REDIRECT:\/profile/);
      assert.equal((await auth.getSession()).role, 'client');
      h.setToken(undefined);
      await assert.rejects(() => actions.login(null, h.form({ email, password: fields.password })), /AUDIT_REDIRECT:\/admin/);
      assert.equal((await auth.getSession()).role, 'client');
      h.setToken(undefined);
      assert.ok((await actions.login(null, h.form({ email: new File(['bad'], 'email'), password: fields.password }))).error);
      let blocked;
      for (let n = 0; n < 10; n++) blocked = await actions.login(null, h.form({ email, password: 'incorrect-password' }));
      assert.match(blocked.error, /15 минут/);
      assert.equal(await auth.getSession(), null);
    });
    await test('Public collect requests remain available to guests and enforce quotas and field limits', async () => {
      h.setToken(undefined);
      const { createParticipantRequest } = h.load('src/actions/client/collectActions.ts');
      const fields = { collectId, nickname: 'Guest', email: 'guest@example.invalid', layoutName: 'Guest layout', layoutLink: 'https://example.invalid/layout', quantity: '10', consent: 'on', layoutsChecked: 'on' };
      assert.equal((await createParticipantRequest(h.form({ ...fields, telegram: 'x'.repeat(101) }))).success, false);
      assert.equal((await createParticipantRequest(h.form({ ...fields, layoutLink: 'javascript:alert(1)' }))).success, false);
      for (let n = 0; n < 5; n++) assert.equal((await createParticipantRequest(h.form(fields))).success, true);
      const blocked = await createParticipantRequest(h.form(fields));
      assert.equal(blocked.success, false);
      assert.match(blocked.error, /15 минут/);
      const rows = await db.select().from(schema.collectParticipants).where(eq(schema.collectParticipants.email, fields.email));
      assert.equal(rows.length, 5);
      assert.ok(rows.every(row => row.userId === null && row.totalPrice === 0));
    });
    await test('JSON-LD escapes closing script tags', async () => {
      const element = h.load('src/components/seo/JsonLd.tsx').JsonLd({ data: { name: '</script><script>bad()</script>' } });
      assert.ok(!element.props.dangerouslySetInnerHTML.__html.includes('</script>'));
    });
    fs.writeFileSync(path.join(__dirname, 'regression-results.json'), JSON.stringify({ passed: passed.length, checks: passed, boundary: 'Original source, disposable SQLite file and real sharp; mocked Next request and upload filesystem. No production HTTP tested.' }, null, 2) + '\n');
  } finally {
    client.close();
    if (path.dirname(path.resolve(directory)) !== path.resolve(os.tmpdir()) || !path.basename(directory).startsWith('reef-security-regression-')) throw new Error('Unsafe cleanup path');
    await fs.promises.rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
