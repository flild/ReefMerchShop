'use server';

import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

// Хелперы для работы с файлами
async function saveImageLocally(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const ext = file.name.split('.').pop() || 'jpg';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads/categories');

  await fs.mkdir(uploadDir, { recursive: true });
  
  const filePath = path.join(uploadDir, fileName);
  await fs.writeFile(filePath, buffer);

  return `/uploads/categories/${fileName}`;
}

async function deleteFileLocally(fileUrl: string) {
  if (!fileUrl.startsWith('/uploads/categories/')) return;
  
  try {
    const fileName = path.basename(fileUrl);
    const filePath = path.join(process.cwd(), 'public/uploads/categories', fileName);
    await fs.unlink(filePath);
  } catch (err) {
    console.error(`Не удалось физически удалить файл ${fileUrl}:`, err);
  }
}

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
    const [item] = await db
      .select({ coverImage: categories.coverImage })
      .from(categories)
      .where(eq(categories.id, id));

    await db.delete(categories).where(eq(categories.id, id));
    
    if (item?.coverImage) {
      await deleteFileLocally(item.coverImage);
    }

    revalidatePath('/admin/categories');
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
  const imageFile = formData.get('image') as File | null;

  if (!name) {
    return { error: 'Название категории обязательно' };
  }

  if (!slug) {
    slug = generateSlug(name);
  }

  try {
    let coverImage = null;
    // Сохраняем файл, если он есть
    if (imageFile && imageFile.size > 0) {
      coverImage = await saveImageLocally(imageFile);
    }

    await db.insert(categories).values({
      id: crypto.randomUUID(),
      name,
      slug,
      description: description || null,
      coverImage,
    });
  } catch (error) {
    console.error('Ошибка создания категории:', error);
    return { error: 'Не удалось сохранить. Возможно, slug уже существует.' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/portfolio');
  redirect('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  let slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const existingImageUrl = formData.get('existingImageUrl') as string;
  const imageFile = formData.get('image') as File | null;

  if (!name) {
    return { error: 'Название обязательно' };
  }

  if (!slug) {
    slug = generateSlug(name);
  }

  try {
    let coverImage = existingImageUrl;
    
    // Если прикрепили новый файл обложки
    if (imageFile && imageFile.size > 0) {
      coverImage = await saveImageLocally(imageFile);
      
      // Сносим старую картинку с диска
      if (existingImageUrl) {
        await deleteFileLocally(existingImageUrl);
      }
    }

    await db.update(categories).set({
      name,
      slug,
      description: description || null,
      coverImage,
    }).where(eq(categories.id, id));
  } catch (error) {
    console.error('Ошибка обновления категории:', error);
    return { error: 'Не удалось обновить. Возможно, slug занят.' };
  }

  revalidatePath('/admin/categories');
  revalidatePath('/admin/portfolio');
  redirect('/admin/categories');
}