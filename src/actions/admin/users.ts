// src/actions/admin/users.ts
'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Твой старый метод остается
export async function updateUserRole(userId: string, newRole: string) {
  try {
    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));
      
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления роли пользователя:', error);
    return { success: false, error: 'Не удалось обновить роль' };
  }
}

export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    return { success: false, error: 'Не удалось удалить пользователя' };
  }
}

export async function createUser(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    // В реале тут должен быть генератор паролей и bcrypt/argon2 хэширование. 
    // Оставляю заглушку под твою систему авторизации.
    const passwordHash = 'dummy_hash_change_me'; 

    if (!name || !email) {
      return { success: false, error: 'Имя и Email обязательны' };
    }

    // Генерим UUID для SQLite
    const newId = crypto.randomUUID();

    await db.insert(users).values({
      id: newId,
      name,
      email,
      role: role || 'client',
      passwordHash,
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    return { success: false, error: 'Не удалось создать пользователя. Возможно, email уже занят.' };
  }
}