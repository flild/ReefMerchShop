import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalculatorClient } from '@/components/calculator/CalculatorClient';

import { db } from '@/db';
import {
  materials,
  accessories,
  pricingTiers,
  pricingSpecialProducts,
  pricingSmallBatchRules,
  pricingModifiers
} from '@/db/schema';
import { eq } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Калькулятор заказа',
  description: 'Точный расчет стоимости производства мерча: акриловые брелоки, стенды. Выбор материалов, фурнитуры и тиража.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/calculator`,
  },
};

export const dynamic = 'force-dynamic';

// Вытягиваем типы прямо из схемы Drizzle, чтобы гарантировать совпадение с БД
type Material = typeof materials.$inferSelect;
type Accessory = typeof accessories.$inferSelect;
type PricingTier = typeof pricingTiers.$inferSelect;
type PricingSpecialProduct = typeof pricingSpecialProducts.$inferSelect;
type PricingSmallBatchRule = typeof pricingSmallBatchRules.$inferSelect;
type PricingModifier = typeof pricingModifiers.$inferSelect;

export default async function CalculatorPage() {
  // Явно указываем типы массивов, избавляясь от implicit any
  let availableMaterials: Material[] = [];
  let availableAccessories: Accessory[] = [];
  let dbPricingTiers: PricingTier[] = [];
  let dbSpecialProducts: PricingSpecialProduct[] = [];
  let dbSmallBatchRules: PricingSmallBatchRule[] = [];
  let dbModifiers: PricingModifier[] = [];

  try {
    [
      availableMaterials,
      availableAccessories,
      dbPricingTiers,
      dbSpecialProducts,
      dbSmallBatchRules,
      dbModifiers
    ] = await Promise.all([
      db.select().from(materials).where(eq(materials.inStock, true)),
      db.select().from(accessories),
      db.select().from(pricingTiers),
      db.select().from(pricingSpecialProducts),
      db.select().from(pricingSmallBatchRules),
      db.select().from(pricingModifiers),
    ]);
  } catch (error) {
    console.error('Ошибка загрузки данных для калькулятора:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-theme-bg">
      <JsonLd />
      <Header />

      <main className="flex-1 py-16 manga-dots">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <CalculatorClient 
            dbMaterials={availableMaterials} 
            dbAccessories={availableAccessories}
            dbPricingTiers={dbPricingTiers}
            dbSpecialProducts={dbSpecialProducts}
            dbSmallBatchRules={dbSmallBatchRules}
            dbModifiers={dbModifiers}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}