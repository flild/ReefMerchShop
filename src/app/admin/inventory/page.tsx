import { db } from '@/db';
import { materials, materialCategories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { StockUpdater } from '@/components/admin/inventory/StockUpdater';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) {
    return <span className="bg-theme-gray-bg text-theme-gray-text px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Нет в наличии</span>;
  }
  if (stock <= minStock) {
    return <span className="bg-theme-yellow-bg text-theme-yellow-text px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Мало</span>;
  }
  return <span className="bg-theme-green-bg text-theme-green-text px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">В норме</span>;
}

export default async function InventoryPage() {
  // Тянем материалы + джоиним названия категорий
  const materialsList = await db
    .select({
      id: materials.id,
      name: materials.name,
      type: materials.type,
      stock: materials.stock,
      minStock: materials.minStock,
      pricePerCm2: materials.pricePerCm2,
      categoryName: materialCategories.name,
    })
    .from(materials)
    .leftJoin(materialCategories, eq(materials.categoryId, materialCategories.id))
    .orderBy(desc(materials.stock));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Склад</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление остатками акрила и материалов
          </p>
        </div>
        <Link href="/admin/inventory/new" className="anime-button px-6 py-3 text-lg block">
        + Добавить материал
        </Link>
      </header>

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">Наименование</th>
                <th className="p-5 font-extrabold">Категория / Тип</th>
                <th className="p-5 font-extrabold">Статус</th>
                <th className="p-5 font-extrabold">Остаток (см²)</th>
              </tr>
            </thead>
            <tbody>
              {materialsList.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors group"
                >
                  <td className="p-5">
                    <div className="font-extrabold text-theme-text text-lg">
                      {item.name}
                    </div>
                    <div className="text-theme-muted text-sm font-bold">
                      {item.pricePerCm2} ₽ / см²
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-theme-text">
                      {item.categoryName || 'Без категории'}
                    </div>
                    <div className="text-theme-muted text-sm font-bold uppercase">
                      {item.type}
                    </div>
                  </td>
                  <td className="p-5">
                    <StockBadge stock={item.stock} minStock={item.minStock} />
                  </td>
                  <td className="p-5">
                    <StockUpdater id={item.id} currentStock={item.stock} />
                  </td>
                </tr>
              ))}
              
              {materialsList.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-theme-muted font-bold text-lg">
                    Материалы не найдены. Создай первый.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}