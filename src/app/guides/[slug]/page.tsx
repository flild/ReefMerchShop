import { db } from '@/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { MarkdownRenderer } from '@/components/guides/MarkdownRenderer';
import { ViewTracker } from '@/components/guides/ViewTracker';
import { ReadTracker } from '@/components/guides/ReadTracker';
import { ArticleFeedback } from '@/components/guides/ArticleFeedback';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  
  if (!result.length || !result[0].isPublished) return { title: 'Статья не найдена' };
  
  const article = result[0];
  
  return {
    title: article.title,
    openGraph: {
      images: article.coverImage ? [article.coverImage] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/guides/${slug}`,
    }
  };
}

export default async function GuideDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  
  const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);

  if (!result.length || !result[0].isPublished) {
    notFound();
  }

  const article = result[0];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative">
      <ViewTracker slug={article.slug} />

      <header className="mb-12 flex flex-col gap-6">
        {article.coverImage && (
          <div className="relative w-full aspect-[21/9] bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
            <Image 
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}

        <div className="flex flex-col items-center text-center gap-4 mt-6">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-theme-text leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-theme-muted font-bold">
            <span>{article.createdAt ? new Date(article.createdAt).toLocaleDateString('ru-RU') : ''}</span>
            <span>•</span>
            <span>👁 {article.viewsCount} просмотров</span>
          </div>
        </div>
      </header>

      <article className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 md:p-12 mb-12">
        <MarkdownRenderer content={article.contentMd} />
      </article>

      {/* Трекер должен быть сразу после контента, чтобы зафиксировать реальное дочитывание */}
      <ReadTracker slug={article.slug} />

      <ArticleFeedback slug={article.slug} />
    </main>
  );
}