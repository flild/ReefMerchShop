import { db } from '@/db';
import { materials, materialCategories, accessories, blanks } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { StockUpdater } from '@/components/admin/inventory/StockUpdater';
import { DeleteMaterialButton } from '@/components/admin/inventory/DeleteMaterialButton';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

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

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab || 'materials';

  // --- Запросы данных в зависимости от вкладки ---
  let listData: any[] = [];
  
  if (activeTab === 'materials') {
    listData = await db
      .select({
        id: materials.id,
        name: materials.name,
        type: materials.type,
        stock: materials.stock,
        minStock: materials.minStock,
        categoryName: materialCategories.name,
      })
      .from(materials)
      .leftJoin(materialCategories, eq(materials.categoryId, materialCategories.id))
      .orderBy(desc(materials.stock));
  } else if (activeTab === 'accessories') {
    listData = await db.select().from(accessories).orderBy(desc(accessories.stock));
  } else if (activeTab === 'blanks') {
    listData = await db
      .select({
        id: blanks.id,
        name: blanks.name,
        size: blanks.size,
        stock: blanks.stock,
        minStock: blanks.minStock,
        materialName: materials.name,
      })
      .from(blanks)
      .leftJoin(materials, eq(blanks.materialId, materials.id))
      .orderBy(desc(blanks.stock));
  }

  // --- Конфиг вкладок ---
  const tabs = [
    { id: 'materials', label: 'Материалы (Форматники)' },
    { id: 'accessories', label: 'Фурнитура' },
    { id: 'blanks', label: 'Заготовки' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Склад</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление инвентаризацией. Ввод вручную (в штуках).
          </p>
        </div>
        
        {/* Кнопка добавления меняет ссылку в зависимости от вкладки */}
        {activeTab === 'materials' && (
          <Link href="/admin/inventory/new" className="anime-button px-6 py-3 text-lg block text-center whitespace-nowrap">
            + Добавить материал
          </Link>
        )}
        {activeTab === 'accessories' && (
          <Link href="/admin/inventory/accessories/new" className="anime-button px-6 py-3 text-lg block text-center whitespace-nowrap">
            + Добавить фурнитуру
          </Link>
        )}
        {activeTab === 'blanks' && (
          <Link href="/admin/inventory/blanks/new" className="anime-button px-6 py-3 text-lg block text-center whitespace-nowrap">
            + Добавить заготовку
          </Link>
        )}
      </header>

      {/* Навигация по вкладкам */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <Link 
            key={t.id}
            href={`/admin/inventory?tab=${t.id}`}
            className={`px-6 py-3 rounded-full font-extrabold transition-all ${
              activeTab === t.id 
                ? 'bg-theme-highlight text-theme-bg' 
                : 'bg-theme-surface border-2 border-theme-border text-theme-text hover:border-theme-highlight hover:text-theme-highlight'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">Наименование</th>
                <th className="p-5 font-extrabold">Характеристики</th>
                <th className="p-5 font-extrabold">Статус</th>
                <th className="p-5 font-extrabold">Остаток (шт.)</th>
                <th className="p-5 font-extrabold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {listData.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors group"
                >
                  <td className="p-5">
                    <div className="font-extrabold text-theme-text text-lg">
                      {item.name}
                    </div>
                  </td>
                  
                  <td className="p-5">
                    {/* Разный рендер характеристик в зависимости от вкладки */}
                    {activeTab === 'materials' && (
                      <>
                        <div className="font-bold text-theme-text">{item.categoryName || 'Без категории'}</div>
                        <div className="text-theme-muted text-sm font-bold uppercase">{item.type}</div>
                      </>
                    )}
                    {activeTab === 'accessories' && (
                      <div className="font-bold text-theme-text">Деталь</div>
                    )}
                    {activeTab === 'blanks' && (
                      <>
                        <div className="font-bold text-theme-text">{item.size || 'Размер не указан'}</div>
                        <div className="text-theme-muted text-sm font-bold">Из: {item.materialName || '—'}</div>
                      </>
                    )}
                  </td>

                  <td className="p-5">
                    <StockBadge stock={item.stock} minStock={item.minStock} />
                  </td>
                  
                  <td className="p-5">
                    <StockUpdater 
                      id={item.id} 
                      currentStock={item.stock} 
                      type={activeTab as 'material' | 'accessory' | 'blank'} 
                    />
                  </td>
                  
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      {activeTab === 'materials' && (
                        <>
                          <Link href={`/admin/inventory/${item.id}/edit`} className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all" title="Редактировать">
                            <Pencil className="w-5 h-5" />
                          </Link>
                          <DeleteMaterialButton id={item.id} />
                        </>
                      )}
                      {/* Для заготовок и фурнитуры пока просто заглушки действий, добавим их формы позже */}
                      {activeTab !== 'materials' && (
                        <span className="text-sm font-bold text-theme-muted">Редакт. в разработке</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {listData.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-theme-muted font-bold text-lg">
                    В этом разделе пока ничего нет.
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