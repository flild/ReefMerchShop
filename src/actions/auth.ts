'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { compare } from 'bcryptjs';
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