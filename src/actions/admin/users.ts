'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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