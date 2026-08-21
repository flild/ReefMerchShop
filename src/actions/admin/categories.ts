'use server';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Генерация ЧПУ
function generateSlug(text: string): string {
  const cyrillic: { [key: string]: string } = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c',
    ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
  };
  
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (match) => cyrillic[match] || match)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, id));
    
    revalidatePath('/admin/portfolio/categories');
    revalidatePath('/admin/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления категории:', error);
    return { success: false, error: 'Не удалось удалить категорию' };
  }
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string;
  let slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  if (!name) {
    return { error: 'Название категории обязательно' };
  }

  if (!slug) {
    slug = generateSlug(name);
  }

  try {
    await db.insert(categories).values({
      id: crypto.randomUUID(),
      name,
      slug,
      description: description || null,
    });
  } catch (error) {
    console.error('Ошибка создания категории:', error);
    return { error: 'Не удалось сохранить. Возможно, slug уже существует.' };
  }

  revalidatePath('/admin/portfolio/categories');
  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  let slug = formData.get('slug') as string;
  const description = formData.get('description') as string;

  if (!name) {
    return { error: 'Название обязательно' };
  }

  if (!slug) {
    slug = generateSlug(name);
  }

  try {
    await db.update(categories).set({
      name,
      slug,
      description: description || null,
    }).where(eq(categories.id, id));
  } catch (error) {
    console.error('Ошибка обновления категории:', error);
    return { error: 'Не удалось обновить. Возможно, slug занят.' };
  }

  revalidatePath('/admin/portfolio/categories');
  revalidatePath('/admin/portfolio');
  redirect('/admin/portfolio/categories');
}