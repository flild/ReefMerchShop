'use server';

import { db } from '@/db';
import { orders, materials, accessories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
  await db.update(orders).set({ status }).where(eq(orders.id, orderId));
  revalidatePath('/admin');
}

export async function updateMaterialStock(materialId: string, stock: number) {
  await db.update(materials).set({ stock }).where(eq(materials.id, materialId));
  revalidatePath('/admin');
}

export async function updateAccessoryStock(accessoryId: string, stock: number) {
  await db.update(accessories).set({ stock }).where(eq(accessories.id, accessoryId));
  revalidatePath('/admin');
}
