import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import path from 'path';

const dbPath = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'local.db')}`;

const globalForDb = globalThis as unknown as {
  client: ReturnType<typeof createClient> | undefined;
};

export const client = globalForDb.client ?? createClient({
  url: dbPath,
});

// Жестко заставляем SQLite уважать связи между таблицами
client.execute('PRAGMA foreign_keys = ON;');

if (process.env.NODE_ENV !== 'production') globalForDb.client = client;

export const db = drizzle(client, { schema });