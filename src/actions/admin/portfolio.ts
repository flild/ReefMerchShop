'use server';

import { db } from '@/db';
import { portfolioItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function deletePortfolioItem(id: string) {
  try {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    revalidatePath('/admin/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления работы:', error);
    return { success: false, error: 'Не удалось удалить работу' };
  }
}

export async function createPortfolioItem(formData: FormData) {
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const imageUrl = formData.get('imageUrl') as string;
  const authorName = formData.get('authorName') as string;
  const description = formData.get('description') as string;

  if (!title || !imageUrl) {
    return { error: 'Название и ссылка на изображение обязательны' };
  }

  try {
    await db.insert(portfolioItems).values({
      id: crypto.randomUUID(),
      title,
      categoryId: categoryId || null,
      imageUrl,
      authorName: authorName || null,
      description: description || null,
    });
  } catch (error) {
    console.error('Ошибка создания работы:', error);
    return { error: 'Не удалось сохранить работу в базу данных' };
  }

  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio');
}