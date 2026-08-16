'use server';

import { db } from '@/db';
import { files, orderProofs, orderStatusHistory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addOrderProof(orderId: string, formData: FormData) {
  // Для MVP принимаем URL загруженного файла (в реальности здесь будет логика S3)
  const fileUrl = formData.get('fileUrl') as string;
  const managerComment = formData.get('managerComment') as string;

  if (!fileUrl) {
    return { error: 'URL изображения обязателен' };
  }

  try {
    const fileId = crypto.randomUUID();

    // 1. Создаем сущность файла
    await db.insert(files).values({
      id: fileId,
      name: `Proof_${orderId}_${Date.now()}`,
      path: fileUrl,
      mimeType: 'image/jpeg',
    });

    // 2. Создаем запись цветопробы
    await db.insert(orderProofs).values({
      id: crypto.randomUUID(),
      orderId,
      fileId,
      status: 'pending',
      managerComment: managerComment || null,
    });

    // 3. Автоматически логируем это в историю статусов заказа
    await db.insert(orderStatusHistory).values({
      id: crypto.randomUUID(),
      orderId,
      status: 'proofing',
      comment: 'Загружена новая цветопроба, ожидается ответ клиента.',
    });

    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка добавления цветопробы:', error);
    return { error: 'Не удалось сохранить данные в БД' };
  }
}