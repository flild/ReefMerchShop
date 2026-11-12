'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { loginSchema, registerSchema } from '@/lib/validations/auth';
import { consumeRateLimit } from '@/lib/rate-limit';

export async function login(_prevState: { error?: string } | null, formData: FormData) {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: 'Проверь email и пароль' };
  const { email, password } = parsed.data;

  if (!email || !password) {
    return { error: 'Заполни все поля, не тупи.' };
  }

  try {
    if (!await consumeRateLimit('login-global', 'all', 300) || !await consumeRateLimit('login', email, 10)) {
      return { error: 'Слишком много попыток. Попробуй через 15 минут.' };
    }
    // Ищем юзера по почте
    const [user] = await db.select().from(users).where(eq(users.email, email));

    // Важно: не даем злоумышленникам понять, есть ли такой email в базе
    if (!user) {
      await compare(password, '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
      return { error: 'Неверный email или пароль.' }; 
    }

    // Сверяем пароль
    const isValid = await compare(password, user.passwordHash);
    if (!isValid) {
      return { error: 'Неверный email или пароль.' };
    }

    // Успех! Создаем JWT сессию
    await createSession(user.id, user.role);
    
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Что-то сломалось на сервере.' };
  }

  // Редиректы делаем ВНЕ блока try-catch, иначе Next.js выбросит ошибку
  // Направляем персонал в админку, обычных юзеров — в их профиль
  redirect('/admin'); 
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}

export async function register(_prevState: { error?: string } | null, formData: FormData) {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { name, email, password, confirmPassword } = parsed.data;

  if (!name || !email || !password) {
    return { error: 'Заполни все поля, не ленись.' };
  }

  if (password !== confirmPassword) {
    return { error: 'Пароли не совпадают. Соберись.' };
  }

  if (password.length < 6) {
    return { error: 'Пароль слишком хилый. Давай минимум 6 символов.' };
  }

  try {
    if (!await consumeRateLimit('register-global', 'all', 30) || !await consumeRateLimit('register', email, 3)) {
      return { error: 'Слишком много попыток. Попробуй через 15 минут.' };
    }
    // Проверяем, не занят ли email
    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return { error: 'Этот email уже используется.' };
    }

    const passwordHash = await hash(password, 10);
    const newId = crypto.randomUUID();

    await db.insert(users).values({
      id: newId,
      name,
      email,
      passwordHash,
      role: 'client', // По умолчанию пускаем только как клиентов[cite: 2]
    });

    // Сразу логиним
    await createSession(newId, 'client');
    
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'База данных поперхнулась. Попробуй еще раз.' };
  }

  // Редирект в профиль для обычных юзеров
  redirect('/profile');
}
