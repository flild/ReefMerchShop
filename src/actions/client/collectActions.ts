'use server';

import { db } from '@/db';
import { collectParticipants, collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createParticipantRequest(formData: FormData) {
  const collectId = formData.get('collectId')?.toString();
  const nickname = formData.get('nickname')?.toString()?.trim();
  const email = formData.get('email')?.toString()?.trim();
  const vkId = formData.get('vkId')?.toString()?.trim();
  const telegram = formData.get('telegram')?.toString()?.trim();
  
  if (!collectId || !nickname || !email) {
    return { error: 'Заполни обязательные поля (Никнейм и Email)' };
  }

  // Защита от дурака: проверяем, открыт ли коллект
  const collectResult = await db
    .select({ status: collects.status })
    .from(collects)
    .where(eq(collects.id, collectId))
    .limit(1);

  if (!collectResult.length) return { error: 'Коллект не найден' };
  if (collectResult[0].status !== 'open') return { error: 'Запись в этот коллект закрыта' };

  const participantId = crypto.randomUUID();

  try {
    await db.insert(collectParticipants).values({
      id: participantId,
      collectId,
      nickname,
      email,
      vkId: vkId || null,
      telegram: telegram || null,
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

// Новый экшен для второго шага (Макеты)
export async function submitParticipantLayouts(participantId: string, collectId: string, formData: FormData) {
  const layoutName = formData.get('layoutName')?.toString()?.trim();
  const layoutLink = formData.get('layoutLink')?.toString()?.trim();
  const quantity = Number(formData.get('quantity'));

  if (!participantId) return { error: 'ID участника не передан' };
  if (!layoutName || !layoutLink || isNaN(quantity) || quantity < 10) {
    return { error: 'Заполни название, ссылку и укажи тираж от 10 шт.' };
  }

  try {
    await db.update(collectParticipants)
      .set({ 
        layoutName,
        layoutLink,
        quantity,
        isLayoutsUploaded: true,
        status: 'layouts_uploaded' 
      })
      .where(eq(collectParticipants.id, participantId));

    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
    return { error: 'Не удалось сохранить данные макетов' };
  }
}