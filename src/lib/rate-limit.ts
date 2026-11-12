import { createHash } from 'node:crypto';
import { client } from '@/db';

let initialized: Promise<unknown> | undefined;

// Persistent quotas are shared by all application processes using this database.
export async function consumeRateLimit(scope: string, identity: string, limit: number, windowMs = 15 * 60 * 1000) {
  initialized ??= client.execute(`CREATE TABLE IF NOT EXISTS security_rate_limits (
    key TEXT PRIMARY KEY, attempts INTEGER NOT NULL, expires_at INTEGER NOT NULL
  )`).catch(error => { initialized = undefined; throw error; });
  await initialized;
  const now = Date.now();
  const key = createHash('sha256').update(`${scope}:${identity}`).digest('hex');
  await client.execute({ sql: 'DELETE FROM security_rate_limits WHERE expires_at <= ?', args: [now] });
  const result = await client.execute({
    sql: `INSERT INTO security_rate_limits(key, attempts, expires_at) VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1
      WHERE attempts < ? RETURNING attempts`,
    args: [key, now + windowMs, limit],
  });
  return result.rows.length === 1;
}
