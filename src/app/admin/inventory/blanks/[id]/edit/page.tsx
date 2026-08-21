import { db } from '@/db';
import { blanks, materials } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BlankForm } from '@/components/admin/inventory/BlankForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditBlankPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [blank] = await db
    .select()
    .from(blanks)
    .where(eq(blanks.id, id));

  if (!blank) {
    notFound();
  }

  const allMaterials = await db.select({
    id: materials.id,
    name: materials.name,
  }).from(materials);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/inventory?tab=blanks" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование заготовки</h1>
          <p className="text-theme-muted font-bold text-lg">
            Измени исходный материал, размеры или остатки детали.
          </p>
        </div>
      </header>

      <BlankForm materials={allMaterials} initialData={blank} />
    </div>
  );
}