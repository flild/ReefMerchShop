// src/app/admin/inventory/page.tsx
import { db } from '@/db';
import { materials, materialTypes, materialCategories, accessories, blanks } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { StockUpdater } from '@/components/admin/inventory/StockUpdater';
import { DeleteButton } from '@/components/admin/inventory/DeleteButton';
import Link from 'next/link';
import { Pencil } from 'lucide-react';

export const dynamic = 'force-dynamic';

type InventoryTab = 'materials' | 'types' | 'accessories' | 'blanks';

interface MaterialRow {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  typeName: string | null;
  categoryName: string | null;
}

interface TypeRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface AccessoryRow {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  price: number;
}

interface BlankRow {
  id: string;
  name: string;
  size: string | null;
  stock: number;
  minStock: number;
  materialName: string | null;
}

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) {
    return <span className="bg-theme-gray-bg text-theme-gray-text px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Нет</span>;
  }
  if (stock <= minStock) {
    return <span className="bg-theme-yellow-bg text-theme-yellow-text px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">Мало</span>;
  }
  return <span className="bg-theme-green-bg text-theme-green-text px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">В норме</span>;
}

interface InventoryPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const { tab } = await searchParams;
  const activeTab: InventoryTab = (tab === 'types' || tab === 'accessories' || tab === 'blanks') ? tab : 'materials';

  const tabs: { id: InventoryTab; label: string }[] = [
    { id: 'materials', label: 'Материалы (Форматники)' },
    { id: 'types', label: 'Типы материалов' },
    { id: 'accessories', label: 'Фурнитура' },
    { id: 'blanks', label: 'Заготовки' },
  ];

  let materialsData: MaterialRow[] = [];
  let typesData: TypeRow[] = [];
  let accessoriesData: AccessoryRow[] = [];
  let blanksData: BlankRow[] = [];

  if (activeTab === 'materials') {
    materialsData = await db
      .select({
        id: materials.id,
        name: materials.name,
        stock: materials.stock,
        minStock: materials.minStock,
        typeName: materialTypes.name,
        categoryName: materialCategories.name,
      })
      .from(materials)
      .leftJoin(materialTypes, eq(materials.typeId, materialTypes.id))
      .leftJoin(materialCategories, eq(materials.categoryId, materialCategories.id))
      .orderBy(desc(materials.stock));
  } else if (activeTab === 'types') {
    typesData = await db
      .select({
        id: materialTypes.id,
        name: materialTypes.name,
        slug: materialTypes.slug,
        description: materialTypes.description,
      })
      .from(materialTypes)
      .orderBy(materialTypes.name);
  } else if (activeTab === 'accessories') {
    accessoriesData = await db
      .select({
        id: accessories.id,
        name: accessories.name,
        stock: accessories.stock,
        minStock: accessories.minStock,
        price: accessories.price,
      })
      .from(accessories)
      .orderBy(desc(accessories.stock));
  } else if (activeTab === 'blanks') {
    blanksData = await db
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

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Склад и материалы</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление инвентаризацией, заготовками и справочником типов материалов.
          </p>
        </div>

        {activeTab === 'materials' && (
          <Link href="/admin/inventory/new" className="anime-button px-6 py-3 text-lg block text-center whitespace-nowrap">
            + Добавить материал
          </Link>
        )}
        {activeTab === 'types' && (
          <Link href="/admin/inventory/types/new" className="anime-button px-6 py-3 text-lg block text-center whitespace-nowrap">
            + Добавить тип
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

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
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
                <th className="p-5 font-extrabold">{activeTab === 'types' ? 'Slug / Описание' : 'Характеристики'}</th>
                {activeTab !== 'types' && <th className="p-5 font-extrabold">Статус</th>}
                {activeTab !== 'types' && <th className="p-5 font-extrabold">Остаток</th>}
                <th className="p-5 font-extrabold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'materials' && materialsData.map((item) => (
                <tr key={item.id} className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors">
                  <td className="p-5 font-extrabold text-theme-text text-lg">{item.name}</td>
                  <td className="p-5">
                    <div className="font-bold text-theme-text">{item.categoryName || 'Без категории'}</div>
                    <div className="text-theme-muted text-sm font-bold uppercase">{item.typeName || 'Без типа'}</div>
                  </td>
                  <td className="p-5"><StockBadge stock={item.stock} minStock={item.minStock} /></td>
                  <td className="p-5"><StockUpdater id={item.id} currentStock={item.stock} type="material" /></td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <Link href={`/admin/inventory/${item.id}/edit`} className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all" title="Редактировать">
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <DeleteButton id={item.id} type="material" />
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'types' && typesData.map((item) => (
                <tr key={item.id} className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors">
                  <td className="p-5 font-extrabold text-theme-text text-lg">{item.name}</td>
                  <td className="p-5">
                    <div className="font-mono text-sm font-bold text-theme-highlight">{item.slug}</div>
                    <div className="text-theme-muted text-sm font-bold">{item.description || '—'}</div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <Link href={`/admin/inventory/types/${item.id}/edit`} className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all" title="Редактировать">
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <DeleteButton id={item.id} type="type" />
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'accessories' && accessoriesData.map((item) => (
                <tr key={item.id} className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors">
                  <td className="p-5 font-extrabold text-theme-text text-lg">{item.name}</td>
                  <td className="p-5 font-bold text-theme-text">{item.price} ₽/шт</td>
                  <td className="p-5"><StockBadge stock={item.stock} minStock={item.minStock} /></td>
                  <td className="p-5"><StockUpdater id={item.id} currentStock={item.stock} type="accessory" /></td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <Link href={`/admin/inventory/accessories/${item.id}/edit`} className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all" title="Редактировать">
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <DeleteButton id={item.id} type="accessory" />
                    </div>
                  </td>
                </tr>
              ))}

              {activeTab === 'blanks' && blanksData.map((item) => (
                <tr key={item.id} className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors">
                  <td className="p-5 font-extrabold text-theme-text text-lg">{item.name}</td>
                  <td className="p-5">
                    <div className="font-bold text-theme-text">{item.size || 'Размер не указан'}</div>
                    <div className="text-theme-muted text-sm font-bold">Из: {item.materialName || '—'}</div>
                  </td>
                  <td className="p-5"><StockBadge stock={item.stock} minStock={item.minStock} /></td>
                  <td className="p-5"><StockUpdater id={item.id} currentStock={item.stock} type="blank" /></td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 shrink-0">
                      <Link href={`/admin/inventory/blanks/${item.id}/edit`} className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all" title="Редактировать">
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <DeleteButton id={item.id} type="blank" />
                    </div>
                  </td>
                </tr>
              ))}

              {((activeTab === 'materials' && materialsData.length === 0) ||
                (activeTab === 'types' && typesData.length === 0) ||
                (activeTab === 'accessories' && accessoriesData.length === 0) ||
                (activeTab === 'blanks' && blanksData.length === 0)) && (
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