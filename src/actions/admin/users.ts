'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

type ActionResponse = {
  success?: boolean;
  error?: string;
};

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Недостаточно прав: действие разрешено только администраторам');
  }
  return session;
}

export async function updateUserRole(userId: string, newRole: string): Promise<ActionResponse> {
  try {
    const session = await assertAdmin();

    // Защита: нельзя понизить самого себя
    if (session.userId === userId && newRole !== 'admin') {
      return { 
        success: false, 
        error: 'Самострел запрещен: нельзя снять права администратора с самого себя. Попроси другого админа.' 
      };
    }

    await db.update(users)
      .set({ role: newRole })
      .where(eq(users.id, userId));
      
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления роли пользователя:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось обновить роль' 
    };
  }
}

export async function deleteUser(userId: string): Promise<ActionResponse> {
  try {
    const session = await assertAdmin();

    // Защита: нельзя удалить собственную учетку
    if (session.userId === userId) {
      return { 
        success: false, 
        error: 'Нельзя удалить собственный аккаунт.' 
      };
    }

    await db.delete(users).where(eq(users.id, userId));
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Не удалось удалить пользователя' 
    };
  }
}

export async function createUser(formData: FormData): Promise<ActionResponse> {
  try {
    await assertAdmin();

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as string;
    const passwordHash = 'dummy_hash_change_me'; 

    if (!name || !email) {
      return { success: false, error: 'Имя и Email обязательны' };
    }

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