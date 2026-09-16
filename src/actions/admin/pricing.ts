'use server';

import { db } from '@/db';
import {
  pricingTiers,
  pricingSpecialProducts,
  pricingSmallBatchRules,
  pricingModifiers,
  accessories
} from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import {
  updatePricingTierSchema,
  updateSpecialProductSchema,
  updateSmallBatchRuleSchema,
  updateModifierSchema,
  updateAccessoryPriceSchema
} from '@/lib/validations/pricing';

async function assertStaffManager() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    throw new Error('У вас нет прав для выполнения этого действия');
  }
  return session;
}

export async function updatePricingTierAction(id: string, price: number) {
  await assertStaffManager();

  const parsed = updatePricingTierSchema.parse({ id, price });

  await db
    .update(pricingTiers)
    .set({ price: parsed.price, updatedAt: new Date() })
    .where(eq(pricingTiers.id, parsed.id));

  revalidatePath('/calculator');
  revalidatePath('/admin/pricing');
}

export async function updateSpecialProductPriceAction(id: string, data: { piecePrice: number; wholesalePrice: number }) {
  await assertStaffManager();

  const parsed = updateSpecialProductSchema.parse({ id, ...data });

  await db
    .update(pricingSpecialProducts)
    .set({ piecePrice: parsed.piecePrice, wholesalePrice: parsed.wholesalePrice })
    .where(eq(pricingSpecialProducts.id, parsed.id));

  revalidatePath('/calculator');
  revalidatePath('/admin/pricing');
}

export async function updateSmallBatchRuleAction(id: string, price: number) {
  await assertStaffManager();

  const parsed = updateSmallBatchRuleSchema.parse({ id, price });

  await db
    .update(pricingSmallBatchRules)
    .set({ price: parsed.price })
    .where(eq(pricingSmallBatchRules.id, parsed.id));

  revalidatePath('/calculator');
  revalidatePath('/admin/pricing');
}

export async function updateModifierPriceAction(id: string, price: number) {
  await assertStaffManager();

  const parsed = updateModifierSchema.parse({ id, price });

  await db
    .update(pricingModifiers)
    .set({ price: parsed.price })
    .where(eq(pricingModifiers.id, parsed.id));

  revalidatePath('/calculator');
  revalidatePath('/admin/pricing');
}

export async function updateAccessoryPriceAction(id: string, price: number) {
  await assertStaffManager();

  const parsed = updateAccessoryPriceSchema.parse({ id, price });

  await db
    .update(accessories)
    .set({ price: parsed.price })
    .where(eq(accessories.id, parsed.id));

  revalidatePath('/calculator');
  revalidatePath('/admin/pricing');
}
