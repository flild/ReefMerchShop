// src/app/admin/inventory/[id]/edit/page.tsx
import { db } from '@/db';
import { materials, materialCategories, materialTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MaterialForm } from '@/components/admin/inventory/MaterialForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface EditMaterialPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMaterialPage({ params }: EditMaterialPageProps) {
  const { id } = await params;

  const [material] = await db
    .select({
      id: materials.id,
      name: materials.name,
      typeId: materials.typeId,
      categoryId: materials.categoryId,
      description: materials.description,
      imageUrl: materials.imageUrl,
      pricePerCm2: materials.pricePerCm2,
      minStock: materials.minStock,
      stock: materials.stock,
    })
    .from(materials)
    .where(eq(materials.id, id));

  if (!material) {
    notFound();
  }

  const [categories, types] = await Promise.all([
    db.select({ id: materialCategories.id, name: materialCategories.name }).from(materialCategories),
    db.select({ id: materialTypes.id, name: materialTypes.name, slug: materialTypes.slug }).from(materialTypes),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/inventory?tab=materials" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование материала</h1>
          <p className="text-theme-muted font-bold text-lg">
            Измени параметры, тип, физические остатки или описание материала.
          </p>
        </div>
      </header>

      <MaterialForm categories={categories} types={types} initialData={material} />
    </div>
  );
}