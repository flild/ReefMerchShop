import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { roleSchema } from '@/lib/validations/auth';
import { decrypt, signSession } from '@/lib/session-token';

export async function createSession(userId: string, role: string) {
  const parsedRole = roleSchema.safeParse(role);
  if (!parsedRole.success) throw new Error('Неизвестная роль');
  const token = await signSession({ userId, role: parsedRole.data });
  (await cookies()).set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.APP_URL?.startsWith('https://') === true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: 'lax', path: '/',
  });
}

export async function deleteSession() {
  (await cookies()).delete('session');
}

export async function getSession() {
  const payload = await decrypt((await cookies()).get('session')?.value);
  if (!payload) return null;
  const [user] = await db.select({ id: users.id, role: users.role })
    .from(users).where(eq(users.id, payload.userId)).limit(1);
  const role = roleSchema.safeParse(user?.role);
  if (!user || !role.success) return null;
  return { userId: user.id, role: role.data };
}

export async function assertStaff() {
  const session = await getSession();
  if (!session || session.role === 'client') throw new Error('Недостаточно прав');
  return session;
}

export async function assertStaffManager() {
  const session = await assertStaff();
  if (session.role === 'maker') throw new Error('Недостаточно прав');
  return session;
}

export async function assertAdmin() {
  const session = await assertStaffManager();
  if (session.role !== 'admin') throw new Error('Недостаточно прав');
  return session;
}
