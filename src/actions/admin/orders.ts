'use server';

import { db } from '@/db';
import { orders, orderStatusHistory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId,
      status,
      comment: 'Статус изменен администратором вручную',
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    return { success: false, error: 'Не удалось обновить статус' };
  }
}

export async function createOrder(formData: FormData) {
  const userId = formData.get('userId') as string;
  const status = formData.get('status') as string || 'new';
  const totalStr = formData.get('total') as string;
  const details = formData.get('details') as string;
  const customClientName = formData.get('customClientName') as string;
  const customClientContact = formData.get('customClientContact') as string;

  const total = parseInt(totalStr, 10);

  if (isNaN(total) || total < 0) {
    return { error: 'Сумма должна быть адекватным числом' };
  }

  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = crypto.randomUUID();

  try {
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId: userId || null,
      status,
      total,
      detailsJson: JSON.stringify({ 
        managerNote: details || '',
        customClientName: customClientName || '',
        customClientContact: customClientContact || ''
      }),
    });

    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId,
      status,
      comment: 'Заказ создан через панель администратора',
    });
  } catch (error) {
    console.error('Ошибка создания заказа:', error);
    return { error: 'Не удалось создать заказ в базе данных' };
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  redirect(`/admin/orders/${orderId}`);
}

export async function updateOrder(id: string, formData: FormData) {
  const userId = formData.get('userId') as string;
  const totalStr = formData.get('total') as string;
  const details = formData.get('details') as string;
  const customClientName = formData.get('customClientName') as string;
  const customClientContact = formData.get('customClientContact') as string;

  const total = parseInt(totalStr, 10);

  if (isNaN(total) || total < 0) {
    return { error: 'Сумма должна быть адекватным числом' };
  }

  try {
    await db.update(orders).set({
      userId: userId || null,
      total,
      detailsJson: JSON.stringify({ 
        managerNote: details || '',
        customClientName: customClientName || '',
        customClientContact: customClientContact || ''
      }),
    }).where(eq(orders.id, id));
  } catch (error) {
    console.error('Ошибка обновления заказа:', error);
    return { error: 'Не удалось обновить заказ в базе данных' };
  }

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  redirect(`/admin/orders/${id}`);
}