'use server';

import { db } from '@/db';
import { materials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

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