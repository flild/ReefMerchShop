'use server';

import { db } from '@/db';
import { orders, orderStatusHistory, files, orderProofs, orderItems} from '@/db/schema';
import { saveImage } from '@/lib/uploads';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { assertStaff, assertStaffManager } from '@/lib/auth';
import { z } from 'zod';


import { orderItemSchema, orderProofSchema, orderSchema } from '@/lib/validations/orders';
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await assertStaff();
    const parsed = z.object({ orderId: z.string().uuid(), status: orderSchema.shape.status }).safeParse({ orderId, status });
    if (!parsed.success) return { success: false, error: 'Некорректный статус заказа' };
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
  await assertStaffManager();
  const parsed = orderSchema.safeParse({ ...Object.fromEntries(formData), userId: formData.get('userId') || null });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { userId, status, total, details, customClientName, customClientContact } = parsed.data;

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
  await assertStaffManager();
  const parsed = orderSchema.safeParse({ ...Object.fromEntries(formData), userId: formData.get('userId') || null });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { userId, total, details, customClientName, customClientContact } = parsed.data;

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

export async function createOrderItem(formData: FormData) {
  await assertStaffManager();
  const rawData = {
    orderId: formData.get('orderId'),
    name: formData.get('name'),
    productType: formData.get('productType'),
    quantity: formData.get('quantity'),
    materialId: formData.get('materialId') || null,
    accessoryId: formData.get('accessoryId') || null,
    areaCm2: formData.get('areaCm2') || null,
    price: formData.get('price'),
    fileId: formData.get('fileId') || null,
  };

  const validation = orderItemSchema.safeParse(rawData);
  if (!validation.success) {
    // Меняем .errors на .issues
    return { success: false, error: validation.error.issues[0].message };
  }

  const data = validation.data;

  try {
    await db.insert(orderItems).values({
      id: crypto.randomUUID(),
      orderId: data.orderId,
      name: data.name,
      productType: data.productType,
      quantity: data.quantity,
      materialId: data.materialId,
      accessoryId: data.accessoryId,
      areaCm2: data.areaCm2,
      price: data.price,
      fileId: data.fileId,
    });
  } catch (error) {
    console.error('Ошибка добавления позиции заказа:', error);
    return { success: false, error: 'Не удалось добавить позицию в базу данных' };
  }

  revalidatePath(`/admin/orders/${data.orderId}`);
  return { success: true };
}

// Экшен загрузки цветопробы локально
export async function uploadOrderProof(formData: FormData) {
  const session = await assertStaff();
  const orderId = formData.get('orderId') as string;
  const orderItemId = formData.get('orderItemId') as string;
  const managerComment = formData.get('managerComment') as string;
  const file = formData.get('file') as File;

  if (!orderId || !orderItemId) {
    return { success: false, error: 'Не указан заказ или позиция' };
  }

  if (!file || file.size === 0) {
    return { success: false, error: 'Файл не выбран' };
  }

  try {
    const validation = orderProofSchema.omit({ fileId: true }).safeParse({ orderId, orderItemId, managerComment: managerComment ?? '' });
    if (!validation.success) return { success: false, error: validation.error.issues[0].message };
    const [item] = await db.select({ id: orderItems.id, orderId: orderItems.orderId }).from(orderItems).where(eq(orderItems.id, orderItemId)).limit(1);
    if (!item || item.orderId !== orderId) return { success: false, error: 'Order item does not belong to order' };
    const saved = await saveImage(file, 'proofs');
    const fileId = crypto.randomUUID();
    await db.insert(files).values({
      id: fileId,
      name: file.name,
      path: saved.path,
      mimeType: saved.mimeType,
      size: saved.size,
      ownerId: session.userId,
    });

    await db.insert(orderProofs).values({
      id: crypto.randomUUID(),
      orderId,
      orderItemId,
      fileId,
      status: 'pending',
      managerComment: managerComment || null,
    });

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    return { success: false, error: 'Ошибка при сохранении файла на сервере.' };
  }
}

// Экшен удаления позиции из заказа
export async function deleteOrderItem(itemId: string, orderId: string) {
  await assertStaffManager();
  try {
    await db.delete(orderItems).where(and(eq(orderItems.id, itemId), eq(orderItems.orderId, orderId)));
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления позиции:', error);
    return { success: false, error: 'Не удалось удалить позицию' };
  }
}

