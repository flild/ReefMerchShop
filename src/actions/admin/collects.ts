'use server';

import { db } from '@/db';
import { collects, collectParticipants, users } from '@/db/schema';
import { eq,sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


// Новый метод для обновления статуса на любой из доступных
export async function updateCollectStatus(id: string, newStatus: string) {
  try {
    await db.update(collects)
      .set({ status: newStatus })
      .where(eq(collects.id, id));
      
    revalidatePath('/admin/collects');
    revalidatePath(`/admin/collects/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка смены статуса коллекта:', error);
    return { success: false, error: 'Ошибка обновления статуса в БД' };
  }
}

export async function createCollect(prevState: any, formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const deadlineStr = formData.get('deadline') as string;
  const productionDate = formData.get('productionDate') as string;
  const driveLink = formData.get('driveLink') as string;
  
  const minCount = Number(formData.get('minCount'));
  const targetSumLimit = Number(formData.get('targetSumLimit')); // Достаем лимит
  const maxDiscount = Number(formData.get('maxDiscount'));       // Достаем макс. скидку (если добавил в схему БД)

  if (!title || !deadlineStr || !productionDate || isNaN(minCount)) {
    return { error: 'Заполнены не все обязательные поля' };
  }

  const deadline = new Date(deadlineStr);

  try {
    await db.insert(collects).values({
      id: crypto.randomUUID(),
      title,
      description: description || '',
      deadline,
      productionDate,
      minCount,
      targetSumLimit: isNaN(targetSumLimit) ? 250000 : targetSumLimit, // Пишем лимит
      currentCount: 0,
      currentSum: 0,
      driveLink: driveLink || null,
      status: 'open',
      // maxDiscount: isNaN(maxDiscount) ? 20 : maxDiscount, // Раскомментируй, если добавишь maxDiscount в схему
    });
  } catch (error) {
    console.error('Ошибка создания коллекта:', error);
    return { error: 'Не удалось сохранить коллект в базу данных' };
  }

  revalidatePath('/admin/collects');
  redirect('/admin/collects');
}

export async function updateParticipantStatus(participantId: string, newStatus: string, collectId: string) {
  try {
    await db.update(collectParticipants)
      .set({ status: newStatus })
      .where(eq(collectParticipants.id, participantId));
      
    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса участника:', error);
    return { success: false, error: 'Не удалось обновить статус' };
  }
}

export async function addParticipant(prevState: any, formData: FormData) {
  const collectId = formData.get('collectId') as string;
  const userId = formData.get('userId') as string;
  const fileId = formData.get('fileId') as string;
  const quantity = Number(formData.get('quantity'));
  const totalPrice = Number(formData.get('totalPrice'));

  if (!collectId || !userId || !fileId || isNaN(quantity) || isNaN(totalPrice)) {
    return { error: 'Заполнены не все поля или данные некорректны' };
  }

  if (quantity < 10) {
    return { error: 'Минимальный тираж — 10 шт. на макет' };
  }

  // Вытаскиваем данные пользователя из БД, чтобы закрыть обязательные поля
  const userRecord = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const userEmail = userRecord[0]?.email || 'no-email@admin.add';
  const userNickname = userRecord[0]?.name || 'Добавлен админом';

  try {
    await db.insert(collectParticipants).values({
      id: crypto.randomUUID(),
      collectId,
      userId,
      fileId,
      quantity,
      totalPrice,
      email: userEmail,       
      nickname: userNickname,
      status: 'pending_payment',
    });
    
    await syncCollectTotals(collectId);
    
  } catch (error) {
    console.error('Ошибка добавления участника:', error);
    return { error: 'База данных подавилась. Не удалось добавить участника.' };
  }

  revalidatePath(`/admin/collects/${collectId}`);
  redirect(`/admin/collects/${collectId}`);
}

export async function updateCollect(id: string, prevState: any, formData: FormData) {
  const title = formData.get('title')?.toString();
  const description = formData.get('description')?.toString();
  const deadlineStr = formData.get('deadline')?.toString();
  const productionDate = formData.get('productionDate')?.toString();
  const driveLink = formData.get('driveLink')?.toString();
  
  const minCount = Number(formData.get('minCount'));
  const targetSumLimit = Number(formData.get('targetSumLimit'));
  const maxDiscount = Number(formData.get('maxDiscount'));

  if (!title || !deadlineStr || !productionDate || isNaN(minCount)) {
    return { error: 'Заполнены не все обязательные поля' };
  }

  try {
    await db.update(collects)
      .set({
        title,
        description: description || '',
        deadline: new Date(deadlineStr),
        productionDate,
        minCount,
        targetSumLimit: isNaN(targetSumLimit) ? 250000 : targetSumLimit,
        driveLink: driveLink || null,
        // maxDiscount: isNaN(maxDiscount) ? 20 : maxDiscount, // Если добавил в БД
      })
      .where(eq(collects.id, id));

  } catch (error) {
    console.error('Ошибка обновления коллекта:', error);
    return { error: 'Не удалось обновить коллект' };
  }

  revalidatePath('/admin/collects');
  revalidatePath(`/admin/collects/${id}`);
  redirect(`/admin/collects/${id}`);
}

export async function deleteCollect(id: string) {
  try {
    await db.delete(collects).where(eq(collects.id, id));
  } catch (error) {
    console.error('Ошибка удаления коллекта:', error);
    throw new Error('Не удалось удалить коллект');
  }

  revalidatePath('/admin/collects');
  redirect('/admin/collects');
}

export async function updateParticipantData(
  participantId: string, 
  collectId: string, 
  data: { 
    nickname: string; 
    email: string;
    vkId: string; 
    telegram: string;
    layoutName: string;
    layoutLink: string;
    quantity: number; 
    totalPrice: number;
  }
) {
  try {
    await db.update(collectParticipants)
      .set({
        nickname: data.nickname || '',
        email: data.email || '',
        vkId: data.vkId || null,
        telegram: data.telegram || null,
        layoutName: data.layoutName || null,
        layoutLink: data.layoutLink || null,
        quantity: data.quantity,
        totalPrice: data.totalPrice,
      })
      .where(eq(collectParticipants.id, participantId));

    // Не забываем дернуть нашу функцию синхронизации банка из прошлого шага!
    await syncCollectTotals(collectId);

    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления участника:', error);
    return { error: 'Не удалось сохранить данные участника' };
  }
}

export async function deleteParticipant(participantId: string, collectId: string) {
  try {
    await db.delete(collectParticipants).where(eq(collectParticipants.id, participantId));
    
    await syncCollectTotals(collectId);
    
    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка удаления участника:', error);
    return { error: 'Не удалось удалить участника' };
  }
}

async function syncCollectTotals(collectId: string) {
  // Получаем агрегированные данные прямо запросом (чтобы не тянуть все объекты в память)
  const result = await db
    .select({
      totalSum: sql<number>`COALESCE(SUM(${collectParticipants.totalPrice}), 0)`,
      totalCount: sql<number>`COALESCE(SUM(${collectParticipants.quantity}), 0)`,
    })
    .from(collectParticipants)
    .where(eq(collectParticipants.collectId, collectId));

  const totals = result[0] || { totalSum: 0, totalCount: 0 };

  // Обновляем родительский коллект
  await db.update(collects)
    .set({
      currentSum: totals.totalSum,
      currentCount: totals.totalCount,
    })
    .where(eq(collects.id, collectId));
}