'use server';

import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

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