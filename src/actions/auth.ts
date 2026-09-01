'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Заполни все поля, не тупи.' };
  }

  try {
    // Ищем юзера по почте
    const [user] = await db.select().from(users).where(eq(users.email, email));

    // Важно: не даем злоумышленникам понять, есть ли такой email в базе
    if (!user) {
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

export async function register(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

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