import { db } from './index';
import {
  pricingTiers,
  pricingSpecialProducts,
  pricingSmallBatchRules,
  pricingModifiers,
  accessories
} from './schema';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

async function seedPricing() {
  console.log('Seeding pricing data...');

  // 1. Pricing Tiers
  // Keychains
  const keychainData = [
    { maxDimensionMm: 30, materialName: 'Прозрачный 3 мм', price: 45 },
    { maxDimensionMm: 30, materialName: 'Жемчужный 3 мм', price: 95 },
    { maxDimensionMm: 30, materialName: 'Цветной 3 мм', price: 76 },
    { maxDimensionMm: 60, materialName: 'Прозрачный 3 мм', price: 72 },
    { maxDimensionMm: 60, materialName: 'Жемчужный 3 мм', price: 142 },
    { maxDimensionMm: 60, materialName: 'Цветной 3 мм', price: 121 },
    { maxDimensionMm: 80, materialName: 'Прозрачный 3 мм', price: 86 },
    { maxDimensionMm: 80, materialName: 'Жемчужный 3 мм', price: 218 },
    { maxDimensionMm: 80, materialName: 'Цветной 3 мм', price: 185 },
  ];

  for (const item of keychainData) {
    await db.insert(pricingTiers).values({
      id: uuidv4(),
      productType: 'keychain',
      ...item
    });
  }

  // Stands
  const standData = [
    { maxDimensionMm: 40, materialName: 'Прозрачный 3 мм', price: 85 },
    { maxDimensionMm: 40, materialName: 'Жемчужный 3 мм', price: 123 },
    { maxDimensionMm: 40, materialName: 'Цветной 3 мм', price: 114 },
    { maxDimensionMm: 40, materialName: 'Прозрачный 8 мм', price: 171 },
    { maxDimensionMm: 40, materialName: 'Жемчужный 8 мм', price: 209 },

    { maxDimensionMm: 60, materialName: 'Прозрачный 3 мм', price: 109 },
    { maxDimensionMm: 60, materialName: 'Жемчужный 3 мм', price: 161 },
    { maxDimensionMm: 60, materialName: 'Цветной 3 мм', price: 147 },
    { maxDimensionMm: 60, materialName: 'Прозрачный 8 мм', price: 218 },
    { maxDimensionMm: 60, materialName: 'Жемчужный 8 мм', price: 305 },

    { maxDimensionMm: 80, materialName: 'Прозрачный 3 мм', price: 142 },
    { maxDimensionMm: 80, materialName: 'Жемчужный 3 мм', price: 389 },
    { maxDimensionMm: 80, materialName: 'Цветной 3 мм', price: 275 },
    { maxDimensionMm: 80, materialName: 'Прозрачный 8 мм', price: 304 },
    { maxDimensionMm: 80, materialName: 'Жемчужный 8 мм', price: 478 },

    { maxDimensionMm: 100, materialName: 'Прозрачный 3 мм', price: 147 },
    { maxDimensionMm: 100, materialName: 'Жемчужный 3 мм', price: 408 },
    { maxDimensionMm: 100, materialName: 'Цветной 3 мм', price: 294 },
    { maxDimensionMm: 100, materialName: 'Прозрачный 8 мм', price: 465 },
    { maxDimensionMm: 100, materialName: 'Жемчужный 8 мм', price: 769 },

    { maxDimensionMm: 150, materialName: 'Прозрачный 3 мм', price: 351 },
    { maxDimensionMm: 150, materialName: 'Жемчужный 3 мм', price: 779 },
    { maxDimensionMm: 150, materialName: 'Цветной 3 мм', price: 427 },
    { maxDimensionMm: 150, materialName: 'Прозрачный 8 мм', price: 722 },
    { maxDimensionMm: 150, materialName: 'Жемчужный 8 мм', price: 1345 },

    { maxDimensionMm: 200, materialName: 'Прозрачный 3 мм', price: 674 },
    { maxDimensionMm: 200, materialName: 'Жемчужный 3 мм', price: 1377 },
    { maxDimensionMm: 200, materialName: 'Цветной 3 мм', price: 750 },
    { maxDimensionMm: 200, materialName: 'Прозрачный 8 мм', price: 1586 },
    { maxDimensionMm: 200, materialName: 'Жемчужный 8 мм', price: 2768 },
  ];

  for (const item of standData) {
    await db.insert(pricingTiers).values({
      id: uuidv4(),
      productType: 'stand',
      ...item
    });
  }

  // 2. Special Products
  await db.insert(pricingSpecialProducts).values([
    {
      id: uuidv4(),
      code: 'icecream_keychain',
      name: 'Брелок-мороженка',
      minWholesaleQty: 5,
      piecePrice: 300,
      wholesalePrice: 90
    },
    {
      id: uuidv4(),
      code: 'nfc_card',
      name: 'NFC-карточка',
      minWholesaleQty: 10,
      piecePrice: 350,
      wholesalePrice: 200
    }
  ]).onConflictDoNothing();

  // 3. Small Batch Rules
  await db.insert(pricingSmallBatchRules).values([
    { id: uuidv4(), productType: 'keychain', maxDimensionMm: 100, price: 600 },
    { id: uuidv4(), productType: 'stand', maxDimensionMm: 100, price: 800 },
    { id: uuidv4(), productType: 'stand', maxDimensionMm: 200, price: 1500 },
  ]);

  // 4. Modifiers
  await db.insert(pricingModifiers).values([
    { id: uuidv4(), code: 'print_double_sided_keychain', name: 'Двусторонняя печать (Брелок)', price: 40 },
    { id: uuidv4(), code: 'print_double_sided_stand', name: 'Двусторонняя печать (Стенд)', price: 70 },
  ]).onConflictDoNothing();

  // 5. Update/Insert Accessories prices
  const accessoriesData = [
    { name: 'U-карабин', price: 30 },
    { name: 'Сердце', price: 38 },
    { name: 'Звезда', price: 38 },
    { name: 'Нить', price: 15 },
    { name: 'Кольца', price: 2 }
  ];

  for (const acc of accessoriesData) {
    const existing = await db.select().from(accessories).where(eq(accessories.name, acc.name)).get();
    if (existing) {
      await db.update(accessories).set({ price: acc.price }).where(eq(accessories.id, existing.id));
    } else {
      await db.insert(accessories).values({
        id: uuidv4(),
        name: acc.name,
        price: acc.price,
        stock: 1000, // default stock
      });
    }
  }

  console.log('Seeding pricing complete.');
}

seedPricing().catch(console.error);
