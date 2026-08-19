'use server';

import { db } from '@/db';
import { materials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateMaterialStock(id: string, newStock: number) {
  try {
    await db.update(materials)
      .set({ 
        stock: newStock, 
        inStock: newStock > 0 
      })
      .where(eq(materials.id, id));
    
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления остатков:', error);
    return { success: false, error: 'Не удалось обновить остатки' };
  }
}

export async function createMaterial(formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const categoryId = formData.get('categoryId') as string;
  const pricePerCm2 = Number(formData.get('pricePerCm2'));
  const minStock = Number(formData.get('minStock'));
  const stock = Number(formData.get('stock'));

  if (!name || !type) {
    return { error: 'Имя и тип обязательны' };
  }

  try {
    await db.insert(materials).values({
      id: crypto.randomUUID(),
      name,
      type,
      categoryId: categoryId || null,
      pricePerCm2: isNaN(pricePerCm2) ? 0 : pricePerCm2,
      minStock: isNaN(minStock) ? 1000 : minStock,
      stock: isNaN(stock) ? 0 : stock,
      inStock: stock > 0,
    });
  } catch (error) {
    console.error('Ошибка создания материала:', error);
    return { error: 'Не удалось сохранить материал в базу' };
  }

  revalidatePath('/admin/inventory');
  redirect('/admin/inventory');
}

export async function updateMaterial(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const categoryId = formData.get('categoryId') as string;
  const pricePerCm2 = Number(formData.get('pricePerCm2'));
  const minStock = Number(formData.get('minStock'));
  const stock = Number(formData.get('stock'));

  if (!name || !type) {
    return { error: 'Имя и тип обязательны' };
  }

  try {
    await db.update(materials).set({
      name,
      type,
      categoryId: categoryId || null,
      pricePerCm2: isNaN(pricePerCm2) ? 0 : pricePerCm2,
      minStock: isNaN(minStock) ? 1000 : minStock,
      stock: isNaN(stock) ? 0 : stock,
      inStock: stock > 0,
    }).where(eq(materials.id, id));
  } catch (error) {
    console.error('Ошибка обновления материала:', error);
    return { error: 'Не удалось обновить материал' };
  }

  revalidatePath('/admin/inventory');
  redirect('/admin/inventory');
}

export async function deleteMaterial(id: string) {
  try {
    await db.delete(materials).where(eq(materials.id, id));
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления материала:', error);
    return { success: false, error: 'Не удалось удалить материал (возможно, он используется в заказах)' };
  }
}