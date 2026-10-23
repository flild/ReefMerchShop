'use server';

import { db } from '@/db';
import { collectParticipants, collects } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { collectRequestSchema } from '@/lib/validations/collect-request';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

type RequestResult =
  | { success: true; participantId: string }
  | { success: false; error: string };

// Публичная запись доступна и гостям; сессию используем для привязки к профилю.
export async function createParticipantRequest(formData: FormData): Promise<RequestResult> {
  const parsed = collectRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { collectId, nickname, email, vkId, telegram, layoutName, layoutLink, quantity } = parsed.data;
  const session = await getSession();
  const participantId = crypto.randomUUID();

  let result: RequestResult;
  try {
    // Проверка набора и сохранение полной заявки происходят в одной транзакции.
    result = await db.transaction(async (tx): Promise<RequestResult> => {
      const [collect] = await tx.select({ status: collects.status })
        .from(collects).where(eq(collects.id, collectId)).limit(1);

      if (!collect) return { success: false, error: 'Коллект не найден' };
      if (collect.status !== 'open') return { success: false, error: 'Запись в этот коллект закрыта' };

      await tx.insert(collectParticipants).values({
        id: participantId,
        collectId,
        userId: session?.userId ?? null,
        nickname,
        email,
        vkId: vkId || null,
        telegram: telegram || null,
        layoutName,
        layoutLink,
        quantity,
        totalPrice: 0,
        status: 'layouts_uploaded',
        isLayoutsUploaded: true,
      });

      return { success: true, participantId };
    });
  } catch (error) {
    console.error('Ошибка создания заявки в коллект:', error);
    return { success: false, error: 'Не удалось отправить заявку. Попробуй ещё раз.' };
  }

  if (result.success) {
    revalidatePath(`/admin/collects/${collectId}`);
    revalidatePath('/admin');
    revalidatePath('/profile');
  }
  return result;
}
