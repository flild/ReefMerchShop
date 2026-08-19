import { db } from '@/db';
import { materials, materialCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MaterialForm } from '@/components/admin/inventory/MaterialForm';

export const dynamic = 'force-dynamic';

export default async function EditMaterialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [material] = await db
    .select()
    .from(materials)
    .where(eq(materials.id, id));

  if (!material) {
    notFound();
  }

  const categories = await db.select().from(materialCategories);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование материала</h1>
        <p className="text-theme-muted font-bold text-lg">
          Измените параметры материала, его тип или категорию.
        </p>
      </header>

      <MaterialForm categories={categories} initialData={material} />
    </div>
  );
}