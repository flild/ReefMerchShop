import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Гайды и статьи',
  description: 'Полезные материалы по подготовке макетов и мерчу от Reef.',
};

export default async function GuidesListPage() {
  const publishedArticles = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      coverImage: articles.coverImage,
      viewsCount: articles.viewsCount,
      createdAt: articles.createdAt,
    })
    .from(articles)
    .where(eq(articles.isPublished, true))
    .orderBy(desc(articles.createdAt));

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
      <header className="mb-12">
        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-theme-text mb-4">
          Гайды и Статьи
        </h1>
        <p className="text-xl font-bold text-theme-muted">
          Полезно, понятно и без воды. Учим делать мерч правильно.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {publishedArticles.map((article) => (
          <Link 
            key={article.id} 
            href={`/guides/${article.slug}`}
            className="group bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover rounded-[40px] flex flex-col overflow-hidden transition-all"
          >
            {article.coverImage ? (
              <div className="relative w-full aspect-[4/3] border-b-2 border-theme-border bg-theme-bg overflow-hidden">
                <Image 
                  src={article.coverImage} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] border-b-2 border-theme-border bg-theme-bg flex items-center justify-center manga-dots">
                <span className="text-4xl font-display font-extrabold text-theme-border">REEF</span>
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-extrabold text-theme-text line-clamp-2 mb-2 group-hover:text-theme-highlight transition-colors">
                {article.title}
              </h3>
              
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-theme-muted font-bold text-sm">
                  {article.createdAt ? new Date(article.createdAt).toLocaleDateString('ru-RU') : ''}
                </span>
                <span className="flex items-center gap-1 text-theme-muted font-bold text-sm bg-theme-bg px-3 py-1 rounded-full border-2 border-theme-border">
                  👁 {article.viewsCount}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {publishedArticles.length === 0 && (
          <div className="col-span-full py-20 text-center bg-theme-surface anime-border rounded-[40px]">
            <p className="text-theme-muted font-bold text-2xl">Ни одной статьи еще не опубликовано.</p>
          </div>
        )}
      </div>
    </main>
  );
}