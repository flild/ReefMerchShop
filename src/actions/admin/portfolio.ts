'use server';

import { db } from '@/db';
import { portfolioItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

// Хелпер для сохранения файла на диск
async function saveImageLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads/portfolio');

  await fs.mkdir(uploadDir, { recursive: true });
  
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/portfolio/${fileName}`;
}

// Хелпер для физического удаления файла с диска
async function deleteFileLocally(fileUrl: string) {
  // Проверяем, что это наш локальный путь, а не внешняя ссылка
  if (!fileUrl.startsWith('/uploads/portfolio/')) return;
  
  try {
    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public/uploads/portfolio', fileName);
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Не удалось физически удалить файл ${fileUrl}:`, err);
    // Ошибку проглатываем, чтобы не заблокировать удаление из БД, 
    // если файла по какой-то причине уже нет на диске.
  }
}

export async function deletePortfolioItem(id: string) {
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
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const authorName = formData.get('authorName') as string;
  const description = formData.get('description') as string;
  const existingImageUrl = formData.get('existingImageUrl') as string;
  
  const imageFile = formData.get('image') as File | null;

  if (!title) {
    return { error: 'Название обязательно' };
  }

  try {
    let imageUrl = existingImageUrl;
    
    // Если прикрепили новый файл
    if (imageFile && imageFile.size > 0) {
      imageUrl = await saveImageLocally(imageFile);
      
      // Удаляем старый файл, чтобы он не лежал мертвым грузом
      if (existingImageUrl) {
        await deleteFileLocally(existingImageUrl);
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