'use server';

import { db } from '@/db';
import { collectParticipants, collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createParticipantRequest(formData: FormData) {
  const collectId = formData.get('collectId')?.toString();
  const nickname = formData.get('nickname')?.toString()?.trim();
  const vkId = formData.get('vkId')?.toString()?.trim();
  
  if (!collectId || !nickname || !vkId) {
    return { error: 'Заполни все обязательные поля' };
  }

  // Защита от дурака: проверяем, существует ли коллект и можно ли в него записаться
  const collectResult = await db
    .select({ status: collects.status })
    .from(collects)
    .where(eq(collects.id, collectId))
    .limit(1);

  if (!collectResult.length) {
    return { error: 'Коллект не найден' };
  }
  if (collectResult[0].status !== 'open') {
    return { error: 'Запись в этот коллект закрыта' };
  }

  // Если прикрутишь авторизацию, тут достаешь userId из сессии
  const participantId = crypto.randomUUID();

  try {
    await db.insert(collectParticipants).values({
      id: participantId,
      collectId,
      nickname,
      vkId,
      quantity: 0,
      totalPrice: 0,
      status: 'new',
      isLayoutsUploaded: false,
    });

    return { success: true, participantId };
  } catch (error) {
    console.error('Ошибка создания заявки:', error);
    return { error: 'БД подавилась. Попробуй еще раз.' };
  }
}

export async function confirmLayoutsUploaded(participantId: string, collectId: string) {
  if (!participantId) {
    return { error: 'ID участника не передан' };
  }

  try {
    await db.update(collectParticipants)
      .set({ 
        isLayoutsUploaded: true,
        status: 'layouts_uploaded' 
      })
      .where(eq(collectParticipants.id, participantId));

    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    return { error: 'Не удалось подтвердить загрузку макетов' };
  }
}