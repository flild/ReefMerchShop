import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { CategoryForm } from '@/components/admin/categories/CategoryForm';

export const dynamic = 'force-dynamic';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [item] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));

  if (!item) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование категории</h1>
        <p className="text-theme-muted font-bold text-lg">
          Измените название, slug или обложку.
        </p>
      </header>

      <CategoryForm initialData={item} />
    </div>
  );
}