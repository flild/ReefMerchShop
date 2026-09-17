import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Palette, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import PortfolioGallery from './PortfolioGallery';
import { db } from '@/db';
import { portfolioItems, categories } from '@/db/schema';
import { desc } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Портфолио готовых работ | Печать мерча',
  description: 'Примеры напечатанного нами мерча: акриловые брелоки, фигурки, стенды и стикеры. Оцените качество печати и реза РИФ в нашей галерее работ.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    title: 'Портфолио готовых работ | Типография РИФ',
    description: 'Галерея реализованных проектов: качественная печать на акриле, брелоки и стенды для авторов мерча.',
    url: '/portfolio',
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';

// Строгая типизация вместо any
type PortfolioItem = InferSelectModel<typeof portfolioItems>;
type Category = InferSelectModel<typeof categories>;

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  let cats: Category[] = [];

  try {
    items = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
    cats = await db.select().from(categories);
  } catch (error) {
    console.error('Failed to load portfolio items:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <BreadcrumbJsonLd items={[
        { name: "Главная", item: "/" },
        { name: "Портфолио", item: "/portfolio" }
      ]} />
      <Header />

      <main className="flex-1 bg-theme-bg manga-dots">
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            
            <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
              <ChevronRight size={14} />
              <span className="text-theme-text" aria-current="page">Портфолио</span>
            </nav>

            <div className="max-w-3xl mb-16 text-center mx-auto">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full anime-border mb-6 text-theme-highlight font-bold text-sm tracking-wide shadow-[2px_2px_0_0_var(--theme-border)] rotate-[1deg]">
                <Palette size={16} />
                Наши любимые работы
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-black text-theme-text mb-8 drop-shadow-sm">
                Галерея чудес
              </h1>
              <p className="text-xl md:text-2xl text-theme-muted font-medium leading-relaxed">
                Посмотрите примеры изделий, которые мы уже произвели. Мы гордимся качеством печати и сборкой каждого мерча!
              </p>
            </div>
            
            <PortfolioGallery items={items} categories={cats} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}