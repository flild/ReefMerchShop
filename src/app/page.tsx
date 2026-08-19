import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';

import { HeroSection } from '@/components/home/HeroSection';
import { PortfolioSection } from '@/components/home/PortfolioSection';
import { CollectsSection } from '@/components/home/CollectsSection';
import { MaterialsSection } from '@/components/home/MaterialsSection';
import { ToolsSection } from '@/components/home/ToolsSection';
import { TemplatesSection } from '@/components/home/TemplatesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaSection } from '@/components/home/CtaSection';
import { GuidesSection } from '@/components/home/GuidesSection';

import { db } from '@/db';
import { materials, portfolioItems, collects, templates, articles } from '@/db/schema';
import { desc, eq, and, ne, sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let recentWorks: any[] = [];
  let popMaterials: any[] = [];
  let activeCollects: any[] = [];
  let availableTemplates: any[] = [];
  let displayArticles: Array<{ id: string; title: string; slug: string; coverImage: string | null; badge: 'new' | 'popular' }> = [];

  try {
    recentWorks = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt)).limit(8);
    popMaterials = await db.select().from(materials).limit(4);
    activeCollects = await db.select().from(collects).where(eq(collects.status, 'open')).limit(2);
    availableTemplates = await db.select().from(templates).limit(4);

    // 1. Вытягиваем самую свежую опубликованную статью
    const recentArticlesList = await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        coverImage: articles.coverImage,
      })
      .from(articles)
      .where(eq(articles.isPublished, true))
      .orderBy(desc(articles.createdAt))
      .limit(1);

    const freshArticle = recentArticlesList[0];

    // 2. Вытягиваем популярные статьи (взвешенная оценка)
    let popularQuery = db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        coverImage: articles.coverImage,
      })
      .from(articles);

    if (freshArticle) {
      // Исключаем свежую статью из популярных
      popularQuery = popularQuery.where(
        and(
          eq(articles.isPublished, true), 
          ne(articles.id, freshArticle.id)
        )
      ) as any; // Приведение типа из-за динамической сборки Where
    } else {
      popularQuery = popularQuery.where(eq(articles.isPublished, true)) as any;
    }

    const popularArticlesList = await popularQuery
      .orderBy(
        desc(sql`(${articles.viewsCount} * 1) + (${articles.readsCount} * 3) + (${articles.likesCount} * 5)`)
      )
      .limit(2);

    // Формируем финальный массив для рендера
    if (freshArticle) {
      displayArticles.push({ ...freshArticle, badge: 'new' });
    }
    popularArticlesList.forEach(a => displayArticles.push({ ...a, badge: 'popular' }));

  } catch (error) {
    console.error('БД отвалилась на главной:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <JsonLd />
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <HeroSection />
        
        {recentWorks.length > 0 && <PortfolioSection items={recentWorks} />}
        {activeCollects.length > 0 && <CollectsSection items={activeCollects} />}
        {popMaterials.length > 0 && <MaterialsSection items={popMaterials} />}
        
        <ToolsSection />
        
        {availableTemplates.length > 0 && <TemplatesSection items={availableTemplates} />}

        {/* Вывод блока статей */}
        {displayArticles.length > 0 && <GuidesSection items={displayArticles} />}
        
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}