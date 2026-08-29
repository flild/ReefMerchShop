// src/lib/collects.ts
export function calculateDiscount(currentSum: number): number {
  const maxDiscount = 20;
  const discount = Math.floor(currentSum / 50000) * 5;
  return Math.min(discount, maxDiscount); 
}
