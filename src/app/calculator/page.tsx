import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { CalculatorClient } from '@/components/calculator/CalculatorClient';

import { db } from '@/db';
import { materials, accessories } from '@/db/schema';
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

export default async function CalculatorPage() {
  // Явно указываем типы массивов, избавляясь от implicit any
  let availableMaterials: Material[] = [];
  let availableAccessories: Accessory[] = [];

  try {
    availableMaterials = await db
      .select()
      .from(materials)
      .where(eq(materials.inStock, true));

    availableAccessories = await db.select().from(accessories);
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
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}