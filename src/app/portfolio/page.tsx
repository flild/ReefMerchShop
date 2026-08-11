import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Palette } from 'lucide-react';
import PortfolioGallery from './PortfolioGallery';
import { db } from '@/db';
import { portfolioItems, categories } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const metadata = {
  title: 'Портфолио | Reef',
  description: 'Примеры готового мерча и качество нашей печати.',
};

export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  let items: any[] = [];
  let cats: any[] = [];

  try {
    items = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt));
    cats = await db.select().from(categories);
  } catch (error) {
    console.error('Failed to load portfolio items:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 bg-reef-light/30 manga-dots">
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl mb-16 text-center mx-auto">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full anime-border mb-6 text-reef-blue font-bold text-sm tracking-wide shadow-sm">
                <Palette size={16} />
                Наши любимые работы
              </div>
              <h1 className="text-5xl md:text-6xl font-display font-black text-slate-800 mb-8 drop-shadow-sm">Галерея чудес</h1>
              <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
                Посмотрите примеры изделий, которые мы уже произвели. Мы гордимся качеством печати и сборкой каждого мерча!
              </p>
            </div>
          </div>

          <PortfolioGallery items={items} categories={cats} />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
