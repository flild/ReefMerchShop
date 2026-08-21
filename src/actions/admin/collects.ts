'use server';

import { db } from '@/db';
import { collects, collectParticipants } from '@/db/schema';
import { eq } from 'drizzle-orm';
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
  const minCount = Number(formData.get('minCount'));
  const driveLink = formData.get('driveLink') as string;

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
      currentCount: 0,
      currentSum: 0,
      driveLink: driveLink || null,
      status: 'open',
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