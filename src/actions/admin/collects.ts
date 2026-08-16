'use server';

import { db } from '@/db';
import { collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function toggleCollectStatus(id: string, currentStatus: string) {
  try {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    
    await db.update(collects)
      .set({ status: newStatus })
      .where(eq(collects.id, id));
      
    revalidatePath('/admin/collects');
    return { success: true };
  } catch (error) {
    console.error('Ошибка смены статуса коллекта:', error);
    return { success: false, error: 'БД подавилась запросом обновления статуса' };
  }
}