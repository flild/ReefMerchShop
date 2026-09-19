'use server';

import { db } from '@/db';
import { templates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export async function createTemplate(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: 'Недостаточно прав' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const size = formData.get('size') as string;
  const productType = formData.get('productType') as string;
  const formatsJson = formData.get('formatsJson') as string || '[]';

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
      formatsJson,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Ошибка создания шаблона:', error);
    return { error: 'Не удалось сохранить шаблон' };
  }

  revalidatePath('/admin/templates');
  redirect('/admin/templates');
}

export async function updateTemplate(id: string, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: 'Недостаточно прав' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const size = formData.get('size') as string;
  const productType = formData.get('productType') as string;
  const formatsJson = formData.get('formatsJson') as string || '[]';

  if (!title) {
    return { error: 'Название обязательно' };
  }

  try {
    await db.update(templates).set({
      title,
      description: description || null,
      size: size || null,
      productType: productType || null,
      formatsJson,
      updatedAt: new Date(),
    }).where(eq(templates.id, id));
  } catch (error) {
    console.error('Ошибка обновления шаблона:', error);
    return { error: 'Не удалось обновить шаблон' };
  }

  revalidatePath('/admin/templates');
  redirect('/admin/templates');
}

export async function deleteTemplate(id: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { success: false, error: 'Недостаточно прав' };
  }

  try {
    await db.delete(templates).where(eq(templates.id, id));
    revalidatePath('/admin/templates');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления шаблона:', error);
    return { success: false, error: 'Не удалось удалить шаблон' };
  }
}
