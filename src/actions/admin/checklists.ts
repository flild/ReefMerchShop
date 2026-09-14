'use server';

import { db } from '@/db';
import { checklistTemplates, checklistBlocks } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getChecklistTemplates() {
  return await db.query.checklistTemplates.findMany({
    orderBy: [desc(checklistTemplates.createdAt)],
    with: {
      blocks: {
        orderBy: (blocks, { asc }) => [asc(blocks.orderIndex)],
      },
    },
  });
}

export async function getChecklistTemplate(id: string) {
  return await db.query.checklistTemplates.findFirst({
    where: eq(checklistTemplates.id, id),
    with: {
      blocks: {
        orderBy: (blocks, { asc }) => [asc(blocks.orderIndex)],
      },
    },
  });
}

export async function createChecklistTemplate(data: { title: string; description: string; imageUrl?: string }) {
  const id = crypto.randomUUID();
  await db.insert(checklistTemplates).values({
    id,
    title: data.title,
    description: data.description || null,
    imageUrl: data.imageUrl || null,
  });
  revalidatePath('/admin/content/checklists');
  return id;
}

export async function updateChecklistTemplate(id: string, data: { title: string; description: string; imageUrl?: string }) {
  await db.update(checklistTemplates).set({
    title: data.title,
    description: data.description || null,
    imageUrl: data.imageUrl || null,
    updatedAt: new Date(),
  }).where(eq(checklistTemplates.id, id));
  revalidatePath('/admin/content/checklists');
  revalidatePath(`/admin/content/checklists/${id}`);
}

export async function deleteChecklistTemplate(id: string) {
  await db.delete(checklistTemplates).where(eq(checklistTemplates.id, id));
  revalidatePath('/admin/content/checklists');
}

export async function createChecklistBlock(templateId: string, data: {
  type: string;
  title: string;
  description: string;
  isRequired: boolean;
  optionsJson: string;
  orderIndex: number;
}) {
  const id = crypto.randomUUID();
  await db.insert(checklistBlocks).values({
    id,
    templateId,
    type: data.type,
    title: data.title,
    description: data.description || null,
    isRequired: data.isRequired,
    optionsJson: data.optionsJson || '[]',
    orderIndex: data.orderIndex,
  });
  revalidatePath(`/admin/content/checklists/${templateId}`);
  return id;
}

export async function updateChecklistBlock(id: string, templateId: string, data: {
  type: string;
  title: string;
  description: string;
  isRequired: boolean;
  optionsJson: string;
  orderIndex: number;
}) {
  await db.update(checklistBlocks).set({
    type: data.type,
    title: data.title,
    description: data.description || null,
    isRequired: data.isRequired,
    optionsJson: data.optionsJson || '[]',
    orderIndex: data.orderIndex,
  }).where(eq(checklistBlocks.id, id));
  revalidatePath(`/admin/content/checklists/${templateId}`);
}

export async function deleteChecklistBlock(id: string, templateId: string) {
  await db.delete(checklistBlocks).where(eq(checklistBlocks.id, id));
  revalidatePath(`/admin/content/checklists/${templateId}`);
}
