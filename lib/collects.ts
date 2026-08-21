// src/lib/collects.ts
export function calculateDiscount(currentSum: number) {
  // За каждые 50к -> 5% скидки. Максимум 20%
  const discountSteps = Math.floor(currentSum / 50000);
  const discount = Math.min(discountSteps * 5, 20);
  return discount;
}