'use server';
import { db } from '@/db';
import { collectParticipants } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createParticipantRequest(formData: FormData) {
  const collectId = formData.get('collectId') as string;
  const nickname = formData.get('nickname') as string;
  const vkId = formData.get('vkId') as string;
  
  // Если у нас будет проверка авторизации, можно достать userId из сессии и подкинуть сюда
  const participantId = crypto.randomUUID();

  await db.insert(collectParticipants).values({
    id: participantId,
    collectId,
    nickname,
    vkId,
    quantity: 0,
    totalPrice: 0,
    status: 'new',
  });

  return { success: true, participantId };
}

export async function confirmLayoutsUploaded(participantId: string, collectId: string) {
  await db.update(collectParticipants)
    .set({ 
      isLayoutsUploaded: true,
      status: 'layouts_uploaded' 
    })
    .where(eq(collectParticipants.id, participantId));

  revalidatePath(`/admin/collects/${collectId}`);
  return { success: true };
}