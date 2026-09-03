// src/actions/admin/collects.ts
'use server';

import { db } from '@/db';
import { collects, collectParticipants } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { collectSchema, participantSchema, updateParticipantDataSchema } from '@/lib/validations/collects';

type ActionResponse = {
  success?: boolean;
  error?: string;
};

// Проверка прав на административные действия (только admin и manager)
async function assertStaffManager() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    throw new Error('Доступ запрещен: недостаточно прав');
  }
  return session;
}

// Проверка прав на базовый доступ к админке (admin, manager, maker)
async function assertStaff() {
  const session = await getSession();
  if (!session || !['admin', 'manager', 'maker'].includes(session.role)) {
    throw new Error('Доступ запрещен: авторизуйтесь как сотрудник');
  }
  return session;
}

export async function updateCollectStatus(id: string, newStatus: string): Promise<ActionResponse> {
  try {
    await assertStaffManager();
    await db.update(collects)
      .set({ status: newStatus })
      .where(eq(collects.id, id));
      
    revalidatePath('/admin/collects');
    revalidatePath(`/admin/collects/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка смены статуса коллекта:', error);
    return { error: error instanceof Error ? error.message : 'Ошибка обновления статуса' };
  }
}

export async function createCollect(
  _prevState: ActionResponse | null, 
  formData: FormData
): Promise<ActionResponse> {
  try {
    await assertStaffManager();
  } catch {
    return { error: 'Недостаточно прав для создания коллекта' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = collectSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Ошибка валидации полей' };
  }

  try {
    await db.insert(collects).values({
      id: crypto.randomUUID(),
      title: parsed.data.title,
      description: parsed.data.description,
      deadline: parsed.data.deadline,
      productionDate: parsed.data.productionDate,
      minCount: parsed.data.minCount,
      targetSumLimit: parsed.data.targetSumLimit,
      currentCount: 0,
      currentSum: 0,
      driveLink: parsed.data.driveLink,
      status: 'open',
    });
  } catch (error) {
    console.error('Ошибка создания коллекта:', error);
    return { error: 'Не удалось сохранить коллект в базу данных' };
  }

  revalidatePath('/admin/collects');
  redirect('/admin/collects');
}

export async function updateParticipantStatus(
  participantId: string, 
  newStatus: string, 
  collectId: string
): Promise<ActionResponse> {
  try {
    // Смену рабочего статуса макета может производить и maker
    await assertStaff();

    await db.update(collectParticipants)
      .set({ status: newStatus })
      .where(eq(collectParticipants.id, participantId));
      
    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления статуса участника:', error);
    return { error: error instanceof Error ? error.message : 'Не удалось обновить статус' };
  }
}

export async function addParticipant(
  _prevState: ActionResponse | null, 
  formData: FormData
): Promise<ActionResponse> {
  try {
    await assertStaffManager();
  } catch {
    return { error: 'Макетчикам запрещено добавлять участников вручную' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = participantSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Ошибка валидации данных участника' };
  }

  const { collectId, nickname, email, vkId, telegram, layoutName, layoutLink, quantity, totalPrice } = parsed.data;

  try {
    await db.insert(collectParticipants).values({
      id: crypto.randomUUID(),
      collectId,
      nickname,
      email,
      vkId,
      telegram,
      layoutName,
      layoutLink,
      quantity,
      totalPrice,
      status: 'pending_payment',
      isLayoutsUploaded: !!layoutLink,
    });
    
    await syncCollectTotals(collectId);
  } catch (error) {
    console.error('Ошибка добавления участника:', error);
    return { error: 'Не удалось добавить участника в базу данных' };
  }

  revalidatePath(`/admin/collects/${collectId}`);
  redirect(`/admin/collects/${collectId}`);
}

export async function updateCollect(
  id: string, 
  _prevState: ActionResponse | null, 
  formData: FormData
): Promise<ActionResponse> {
  try {
    await assertStaffManager();
  } catch (error) {
    return { error: 'Недостаточно прав для редактирования' };
  }

  const title = formData.get('title')?.toString();
  const description = formData.get('description')?.toString() || '';
  const deadlineStr = formData.get('deadline')?.toString();
  const productionDate = formData.get('productionDate')?.toString();
  const driveLink = formData.get('driveLink')?.toString() || null;
  const minCount = Number(formData.get('minCount'));
  const targetSumLimit = Number(formData.get('targetSumLimit'));

  if (!title || !deadlineStr || !productionDate || isNaN(minCount)) {
    return { error: 'Заполнены не все обязательные поля' };
  }

  try {
    await db.update(collects)
      .set({
        title,
        description,
        deadline: new Date(deadlineStr),
        productionDate,
        minCount,
        targetSumLimit: isNaN(targetSumLimit) ? 250000 : targetSumLimit,
        driveLink,
      })
      .where(eq(collects.id, id));
  } catch (error) {
    console.error('Ошибка обновления коллекта:', error);
    return { error: 'Не удалось обновить коллективный сбор' };
  }

  revalidatePath('/admin/collects');
  revalidatePath(`/admin/collects/${id}`);
  redirect(`/admin/collects/${id}`);
}

export async function deleteCollect(id: string): Promise<ActionResponse> {
  try {
    await assertStaffManager();
    await db.delete(collects).where(eq(collects.id, id));
  } catch (error) {
    console.error('Ошибка удаления коллекта:', error);
    return { error: 'Не удалось удалить коллективный сбор' };
  }

  revalidatePath('/admin/collects');
  redirect('/admin/collects');
}

export async function updateParticipantData(
  participantId: string, 
  collectId: string, 
  data: unknown
): Promise<ActionResponse> {
  const session = await assertStaff();
  const isMaker = session.role === 'maker';

  const parsed = updateParticipantDataSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Ошибка валидации данных' };
  }

  try {
    const updatePayload: Record<string, unknown> = {
      nickname: parsed.data.nickname,
      email: parsed.data.email,
      vkId: parsed.data.vkId,
      telegram: parsed.data.telegram,
      layoutName: parsed.data.layoutName,
      layoutLink: parsed.data.layoutLink,
      quantity: parsed.data.quantity,
    };

    if (!isMaker && typeof parsed.data.totalPrice === 'number') {
      updatePayload.totalPrice = parsed.data.totalPrice;
    }

    await db.update(collectParticipants)
      .set(updatePayload)
      .where(eq(collectParticipants.id, participantId));

    if (!isMaker) {
      await syncCollectTotals(collectId);
    }

    revalidatePath(`/admin/collects/${collectId}`);
    return { success: true };
  } catch (error) {
    console.error('Ошибка обновления участника:', error);
    return { error: 'Не удалось сохранить данные участника' };
  }
}

export async function deleteParticipant(participantId: string, collectId: string): Promise<ActionResponse> {
  try {
    await assertStaffManager();
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
  const result = await db
    .select({
      totalSum: sql<number>`COALESCE(SUM(${collectParticipants.totalPrice}), 0)`,
      totalCount: sql<number>`COALESCE(SUM(${collectParticipants.quantity}), 0)`,
    })
    .from(collectParticipants)
    .where(eq(collectParticipants.collectId, collectId));

  const totals = result[0] || { totalSum: 0, totalCount: 0 };

  await db.update(collects)
    .set({
      currentSum: totals.totalSum,
      currentCount: totals.totalCount,
    })
    .where(eq(collects.id, collectId));
}