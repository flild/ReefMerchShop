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

export const createPricingTierSchema = z.object({
  productType: z.enum(['keychain', 'stand']),
  maxDimensionMm: z.number().int().positive(),
  materialName: z.string().min(1),
  price: z.number().int().nonnegative(),
});

export const createSpecialProductSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  minWholesaleQty: z.number().int().positive(),
  piecePrice: z.number().int().nonnegative(),
  wholesalePrice: z.number().int().nonnegative(),
});

export const createSmallBatchRuleSchema = z.object({
  productType: z.enum(['keychain', 'stand']),
  maxDimensionMm: z.number().int().positive(),
  price: z.number().int().nonnegative(),
});

export const createModifierSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
});

export const createAccessorySchema = z.object({
  name: z.string().min(1),
  price: z.number().int().nonnegative(),
});

export const deletePricingItemSchema = z.object({
  id: z.string(),
});
