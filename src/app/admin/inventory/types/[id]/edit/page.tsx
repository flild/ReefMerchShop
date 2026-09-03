// src/app/admin/inventory/types/[id]/edit/page.tsx
import { db } from '@/db';
import { materialTypes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { MaterialTypeForm } from '@/components/admin/inventory/MaterialTypeForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface EditMaterialTypePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMaterialTypePage({ params }: EditMaterialTypePageProps) {
  const { id } = await params;

  const [typeItem] = await db
    .select({
      id: materialTypes.id,
      name: materialTypes.name,
      slug: materialTypes.slug,
      description: materialTypes.description,
    })
    .from(materialTypes)
    .where(eq(materialTypes.id, id));

  if (!typeItem) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/inventory?tab=types" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование типа</h1>
          <p className="text-theme-muted font-bold text-lg">
            Измени название или системный slug типа материала.
          </p>
        </div>
      </header>

      <MaterialTypeForm initialData={typeItem} />
    </div>
  );
}