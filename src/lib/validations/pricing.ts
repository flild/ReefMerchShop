import { z } from 'zod';

export const updatePricingTierSchema = z.object({
  id: z.string(),
  price: z.number().int().nonnegative(),
});

export const updateSpecialProductSchema = z.object({
  id: z.string(),
  piecePrice: z.number().int().nonnegative(),
  wholesalePrice: z.number().int().nonnegative(),
});

export const updateSmallBatchRuleSchema = z.object({
  id: z.string(),
  price: z.number().int().nonnegative(),
});

export const updateModifierSchema = z.object({
  id: z.string(),
  price: z.number().int().nonnegative(),
});

export const updateAccessoryPriceSchema = z.object({
  id: z.string(),
  price: z.number().int().nonnegative(),
});
