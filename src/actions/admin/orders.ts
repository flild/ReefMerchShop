'use server';

import { db } from '@/db';
import { orders, orderStatusHistory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // Обновляем сам заказ
    await db.update(orders).set({ status }).where(eq(orders.id, orderId));
    
    // Обязательно пишем в историю, чтобы на странице заказа был лог
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

  const total = parseInt(totalStr, 10);

  if (isNaN(total) || total < 0) {
    return { error: 'Сумма должна быть адекватным числом' };
  }

  // Генерируем красивый 6-значный номер заказа
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = crypto.randomUUID();

  try {
    await db.insert(orders).values({
      id: orderId,
      orderNumber,
      userId: userId || null,
      status,
      total,
      detailsJson: JSON.stringify({ managerNote: details || '' }),
    });

    // Делаем первую запись в историю
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
  
  // Редиректим админа сразу на страницу свежесозданного заказа
  redirect(`/admin/orders/${orderId}`);
}