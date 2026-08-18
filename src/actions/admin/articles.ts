'use server';

import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { writeFile } from 'fs/promises';
import path from 'path';

// Простой генератор slug из названия (в идеале использовать библиотеку типа slugify, но для MVP хватит)
function generateSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function createArticle(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  let slug = formData.get('slug') as string;

  if (!title) {
    return { error: 'Название статьи обязательно' };
  }

  if (!slug) {
    slug = generateSlug(title);
  }

  const id = crypto.randomUUID();

  try {
    await db.insert(articles).values({
      id,
      title,
      slug: `${slug}-${Date.now().toString().slice(-4)}`, // Добавляем хвост, чтобы избежать дублей
      contentMd: 'Напиши здесь крутой гайд...',
      isPublished: false, // Всегда создаем как черновик
    });
  } catch (error) {
    console.error('Ошибка создания статьи:', error);
    return { error: 'Не удалось создать статью. Возможно, такой slug уже существует.' };
  }

  // После создания сразу редиректим в редактор этой статьи
  revalidatePath('/admin/content/articles');
  redirect(`/admin/content/articles/${id}`);
}

export async function toggleArticlePublish(id: string, currentStatus: boolean) {
  try {
    await db.update(articles)
      .set({ 
        isPublished: !currentStatus, 
        updatedAt: new Date() 
      })
      .where(eq(articles.id, id));
      
    revalidatePath('/admin/content/articles');
    revalidatePath('/guides');
    return { success: true };
  } catch (error) {
    console.error('Ошибка изменения статуса статьи:', error);
    return { success: false, error: 'Ошибка БД' };
  }
}

export async function deleteArticle(id: string) {
  try {
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath('/admin/content/articles');
    revalidatePath('/guides');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления статьи:', error);
    return { success: false, error: 'Ошибка БД при удалении' };
  }
}

export async function updateArticle(id: string, prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const coverImage = formData.get('coverImage') as string;
  const contentMd = formData.get('contentMd') as string;

  if (!title || !slug) {
    return { error: 'Название и Slug обязательны' };
  }

  try {
    await db.update(articles)
      .set({ 
        title, 
        slug, 
        coverImage: coverImage || null, 
        contentMd, 
        updatedAt: new Date() 
      })
      .where(eq(articles.id, id));
      
    revalidatePath('/admin/content/articles');
    revalidatePath(`/admin/content/articles/${id}`);
    revalidatePath('/guides');
    
    return { success: true, message: 'Статья успешно сохранена' };
  } catch (error) {
    console.error('Ошибка сохранения статьи:', error);
    return { error: 'Не удалось сохранить изменения. Возможно, Slug дублируется.' };
  }
}

export async function uploadArticleImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file || !(file instanceof File)) {
    return { error: 'Файл не найден или имеет неверный формат' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Генерируем уникальное имя без пробелов
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    // В MVP сохраняем локально. Папка public/uploads должна существовать
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    await writeFile(filepath, buffer);
    
    return { url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return { error: 'Сервер не смог сохранить файл' };
  }
}