'use server';

import { assertStaffManager } from '@/lib/auth';

import { db } from '@/db';
import { portfolioItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveImage, removeImage } from '@/lib/uploads';


// Хелпер для сохранения файла на диск
async function saveImageLocally(file: File) { return (await saveImage(file, 'portfolio')).path; }
async function deleteFileLocally(url: string) { await removeImage(url); }

export async function deletePortfolioItem(id: string) {
  await assertStaffManager();
  try {
    // Сначала достаем запись, чтобы узнать путь к картинке
    const [item] = await db
      .select({ imageUrl: portfolioItems.imageUrl })
      .from(portfolioItems)
      .where(eq(portfolioItems.id, id));

    // Удаляем из базы
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
    
    // Если запись была и там был урл - сносим файл с диска
    if (item?.imageUrl) {
      await deleteFileLocally(item.imageUrl);
    }

    revalidatePath('/admin/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления работы:', error);
    return { success: false, error: 'Не удалось удалить работу' };
  }
}

export async function createPortfolioItem(formData: FormData) {
  await assertStaffManager();
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const authorName = formData.get('authorName') as string;
  const description = formData.get('description') as string;
  const imageFile = formData.get('image') as File | null;

  if (!title || !imageFile || imageFile.size === 0) {
    return { error: 'Название и картинка обязательны' };
  }

  try {
    const imageUrl = await saveImageLocally(imageFile);

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
    return { error: 'Не удалось сохранить работу' };
  }

  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio');
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  await assertStaffManager();
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const authorName = formData.get('authorName') as string;
  const description = formData.get('description') as string;

  
  const imageFile = formData.get('image') as File | null;

  if (!title) {
    return { error: 'Название обязательно' };
  }

  try {
    const [existing] = await db.select({ imageUrl: portfolioItems.imageUrl }).from(portfolioItems).where(eq(portfolioItems.id, id)).limit(1);
    if (!existing) return { error: 'Portfolio item not found' };
    let imageUrl = existing.imageUrl;
    
    // Если прикрепили новый файл
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveImageLocally(imageFile);
      
      // Удаляем старый файл, чтобы он не лежал мертвым грузом
      if (existing.imageUrl) {
        await deleteFileLocally(existing.imageUrl);
      }
    }

    await db.update(portfolioItems).set({
      title,
      categoryId: categoryId || null,
      imageUrl,
      authorName: authorName || null,
      description: description || null,
    }).where(eq(portfolioItems.id, id));
  } catch (error) {
    console.error('Ошибка обновления работы:', error);
    return { error: 'Не удалось обновить работу' };
  }

  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio');
}