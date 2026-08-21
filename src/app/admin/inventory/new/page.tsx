import { db } from '@/db';
import { materialCategories } from '@/db/schema';
import { MaterialForm } from '@/components/admin/inventory/MaterialForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewMaterialPage() {
  const categories = await db.select().from(materialCategories);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <Link 
          href="/admin/inventory?tab=materials" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Новый материал</h1>
          <p className="text-theme-muted font-bold text-lg">
            Добавь позицию на склад, чтобы она появилась в калькуляторе.
          </p>
        </div>
      </header>

      <MaterialForm categories={categories} />
    </div>
  );
}