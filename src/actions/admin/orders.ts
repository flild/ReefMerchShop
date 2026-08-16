'use server';

import { db } from '@/db';
import { orders, orderStatusHistory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, newStatus: string, comment?: string) {
  try {
    // 1. Обновляем статус в самом заказе
    await db.update(orders)
      .set({ status: newStatus })
      .where(eq(orders.id, orderId));
      
    // 2. Пишем лог в историю статусов
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId,
      status: newStatus,
      comment: comment || 'Статус изменен менеджером из панели администратора',
    });
    
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса заказа:', error);
    return { success: false, error: 'Не удалось обновить статус' };
  }
}