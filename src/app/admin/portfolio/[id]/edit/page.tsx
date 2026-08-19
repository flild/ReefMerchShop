import { db } from '@/db';
import { portfolioItems, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { PortfolioForm } from '@/components/admin/portfolio/PortfolioForm';

export const dynamic = 'force-dynamic';

export default async function EditPortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [item] = await db
    .select()
    .from(portfolioItems)
    .where(eq(portfolioItems.id, id));

  if (!item) {
    notFound();
  }

  const allCategories = await db.select().from(categories);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование работы</h1>
        <p className="text-theme-muted font-bold text-lg">
          Исправьте информацию о загруженной работе.
        </p>
      </header>

      <PortfolioForm categories={allCategories} initialData={item} />
    </div>
  );
}