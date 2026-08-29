'use server';

import { db } from '@/db';
import { orders, orderStatusHistory, files, orderProofs, orderItems} from '@/db/schema';
import { writeFile, mkdir } from 'fs/promises';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import path from 'path';


import { orderItemSchema, orderProofSchema } from '@/lib/validations/orders';
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

export async function createOrderItem(formData: FormData) {
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
    // 1. Конвертируем файл в буфер
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Создаем директорию, если её нет
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'proofs');
    await mkdir(uploadDir, { recursive: true });

    // 3. Генерируем уникальное имя файла, чтобы не перезаписать чужие
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // 4. Пишем файл на диск
    await writeFile(filePath, buffer);

    // Относительный путь для веба (Next.js отдаст его из public)
    const publicPath = `/uploads/proofs/${uniqueFilename}`;

    // 5. Записываем метаданные в таблицу files
    const fileId = crypto.randomUUID();
    await db.insert(files).values({
      id: fileId,
      name: file.name,
      path: publicPath,
      mimeType: file.type,
      size: file.size,
    });

    // 6. Создаем саму цветопробу
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
  try {
    await db.delete(orderItems).where(eq(orderItems.id, itemId));
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления позиции:', error);
    return { success: false, error: 'Не удалось удалить позицию' };
  }
}

