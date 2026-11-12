import { jwtVerify, SignJWT } from 'jose';
import { sessionSchema } from '@/lib/validations/auth';
import type { z } from 'zod';

export type SessionPayload = z.infer<typeof sessionSchema>;

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || secret === 'super_secret_dev_key_123') {
    throw new Error('JWT_SECRET must contain at least 32 random characters');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload) {
  const parsed = sessionSchema.safeParse(payload);
  if (!parsed.success) throw new Error('Некорректные данные сессии');
  return new SignJWT(parsed.data).setProtectedHeader({ alg: 'HS256' })
    .setIssuer('reef').setAudience('reef').setIssuedAt().setExpirationTime('7d').sign(secretKey());
}

export async function decrypt(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), {
      algorithms: ['HS256'], issuer: 'reef', audience: 'reef',
      requiredClaims: ['iat', 'exp'], maxTokenAge: '7d',
    });
    const parsed = sessionSchema.safeParse(payload);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
