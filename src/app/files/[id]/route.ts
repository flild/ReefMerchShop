import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { files, orders, orderProofs } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return new Response(null, { status: 401 });
  const parsed = z.string().uuid().safeParse((await params).id);
  if (!parsed.success) return new Response(null, { status: 404 });
  const [file] = await db.select().from(files).where(eq(files.id, parsed.data)).limit(1);
  if (!file) return new Response(null, { status: 404 });
  if (session.role === 'client') {
    const [proof] = await db.select({ id: orderProofs.id }).from(orderProofs)
      .innerJoin(orders, eq(orderProofs.orderId, orders.id))
      .where(and(eq(orderProofs.fileId, file.id), eq(orders.userId, session.userId))).limit(1);
    if (!proof) return new Response(null, { status: 404 });
  }
  const privateMatch = /^private:proofs\/([a-f0-9-]{36}\.jpg)$/.exec(file.path);
  const legacyMatch = /^\/uploads\/proofs\/([a-zA-Z0-9_.-]+)$/.exec(file.path);
  if (!privateMatch && !legacyMatch) return new Response(null, { status: 404 });
  const filePath = privateMatch
    ? path.join(process.cwd(), 'uploads/proofs', privateMatch[1])
    : path.join(process.cwd(), 'public/uploads/proofs', legacyMatch![1]);
  try {
    const buffer = await readFile(filePath);
    return new Response(buffer, { headers: {
      'Content-Type': privateMatch ? 'image/jpeg' : 'application/octet-stream',
      'Content-Disposition': `attachment; filename="proof-${file.id}${privateMatch ? '.jpg' : ''}"`,
      'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
    } });
  } catch {
    return new Response(null, { status: 404 });
  }
}
