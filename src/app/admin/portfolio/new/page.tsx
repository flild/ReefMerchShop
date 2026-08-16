import { db } from '@/db';
import { categories } from '@/db/schema';
import { PortfolioForm } from '@/components/admin/portfolio/PortfolioForm';

export const dynamic = 'force-dynamic';

export default async function NewPortfolioItemPage() {
  const allCategories = await db.select().from(categories);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новая работа в портфолио</h1>
        <p className="text-theme-muted font-bold text-lg">
          Добавьте свежий пример мерча на витрину.
        </p>
      </header>

      <PortfolioForm categories={allCategories} />
    </div>
  );
}