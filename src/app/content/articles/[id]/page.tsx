import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ArticleEditorForm } from '@/components/admin/guides/ArticleEditorForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ArticleEditorPage({ params }: PageProps) {
  const { id } = await params;

  const result = await db.select().from(articles).where(eq(articles.id, id)).limit(1);

  if (!result.length) {
    notFound();
  }

  const article = result[0];

  return (
    <div className="flex flex-col gap-8 max-w-[1200px] mx-auto w-full">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Редактор</h1>
        <p className="text-theme-muted font-bold text-lg">
          Настройка метаданных и текста статьи.
        </p>
      </header>

      <ArticleEditorForm article={article} />
    </div>
  );
}