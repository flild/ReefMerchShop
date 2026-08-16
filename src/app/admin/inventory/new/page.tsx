import { db } from '@/db';
import { materialCategories } from '@/db/schema';
import { MaterialForm } from '@/components/admin/inventory/MaterialForm';

export const dynamic = 'force-dynamic';

export default async function NewMaterialPage() {
  const categories = await db.select().from(materialCategories);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новый материал</h1>
        <p className="text-theme-muted font-bold text-lg">
          Добавь позицию на склад, чтобы она появилась в калькуляторе.
        </p>
      </header>

      <MaterialForm categories={categories} />
    </div>
  );
}