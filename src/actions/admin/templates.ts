'use server';

import { db } from '@/db';
import { templates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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

type ActionState = { error?: string } | null;

export async function createTemplate(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const size = formData.get('size') as string;
  const productType = formData.get('productType') as string;
  
  // Собираем все отмеченные чекбоксы с именем formats
  const formats = formData.getAll('formats') as string[];

  if (!title) {
    return { error: 'Название шаблона обязательно' };
  }

  try {
    await db.insert(templates).values({
      id: crypto.randomUUID(),
      title,
      description: description || null,
      size: size || null,
      productType: productType || null,
      formatsJson: JSON.stringify(formats),
    });
  } catch (error) {
    console.error('Ошибка создания шаблона:', error);
    return { error: 'Не удалось сохранить шаблон в базу данных' };
  }

  revalidatePath('/admin/content');
  redirect('/admin/content');
}