'use server';

import { db } from '@/db';
import { templates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function deleteTemplate(id: string) {
  try {
    await db.delete(templates).where(eq(templates.id, id));
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления шаблона:', error);
    return { success: false, error: 'БД подавилась и не смогла удалить шаблон' };
  }
}