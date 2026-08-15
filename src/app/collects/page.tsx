import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/db';
import { collects } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { CollectsList } from '@/components/collects/CollectsList';

export const metadata: Metadata = {
  title: 'Коллекты',
  description: 'Совместные заказы для снижения стоимости производства мерча. Объединяйтесь с другими авторами!',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.ru'}/collects`,
  },
};

export default async function CollectsPage() {

  const activeCollects = await db
    .select()
    .from(collects)
    .orderBy(desc(collects.deadline));

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://reef.ru/" },
      { "@type": "ListItem", "position": 2, "name": "Коллекты", "item": "https://reef.ru/collects" }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <Header />

      <main className="flex-1 py-24 bg-theme-bg manga-dots">
        <div className="container mx-auto px-4 max-w-5xl">

          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">Коллекты</span>
          </nav>

          <header className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full anime-border mb-6 text-theme-highlight font-bold text-sm tracking-wide shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
              <Sparkles size={16} />
              Совместные закупки
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-theme-text mb-8 drop-shadow-sm">
              Коллекты
            </h1>
            <p className="text-xl md:text-2xl text-theme-muted max-w-3xl mx-auto font-medium leading-relaxed mb-6">
              Объединяйтесь с другими авторами для производства мерча. Больший общий тираж — меньшая цена для каждого!
            </p>

            <div className="max-w-2xl mx-auto p-6 bg-theme-surface anime-border anime-shadow text-theme-text font-medium leading-relaxed mt-10 text-left">
              <span className="font-bold flex items-center gap-2 mb-2 text-theme-highlight text-lg">
                <Sparkles size={20} /> Система скидок:
              </span>
              При общем заказе от 50 тыс. руб. добавляется скидка 5%, и за каждые 50 тыс. добавляется также 5%, но максимальная скидка 15% (то есть 150к надо набрать для макс. скидки).
            </div>
          </header>

          <CollectsList initialCollects={activeCollects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}