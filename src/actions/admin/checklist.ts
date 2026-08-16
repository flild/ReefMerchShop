'use server';

import { db } from '@/db';
import { checklistRules } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function toggleRuleStatus(id: string, currentStatus: boolean) {
  try {
    await db.update(checklistRules)
      .set({ isActive: !currentStatus })
      .where(eq(checklistRules.id, id));
      
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Ошибка переключения статуса правила:', error);
    return { success: false, error: 'Ошибка БД' };
  }
}

export async function deleteRule(id: string) {
  try {
    await db.delete(checklistRules).where(eq(checklistRules.id, id));
    revalidatePath('/admin/content');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления правила:', error);
    return { success: false, error: 'Ошибка БД' };
  }
}

export async function createRule(prevState: any, formData: FormData) {
  const productType = formData.get('productType') as string;
  const parameter = formData.get('parameter') as string;
  const expectedValue = formData.get('expectedValue') as string;
  const warningMessage = formData.get('warningMessage') as string;

  if (!productType || !parameter || !expectedValue || !warningMessage) {
    return { error: 'Все поля обязательны для заполнения' };
  }

  try {
    await db.insert(checklistRules).values({
      id: crypto.randomUUID(),
      productType,
      parameter,
      expectedValue,
      warningMessage,
      isActive: true, // Drizzle с { mode: 'boolean' } сам сконвертирует в 1
    });
  } catch (error) {
    console.error('Ошибка создания правила:', error);
    return { error: 'Не удалось сохранить правило в БД' };
  }

  revalidatePath('/admin/content');
  redirect('/admin/content');
}