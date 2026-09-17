import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { db } from '@/db';
import { collects } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { CollectsList } from '@/components/collects/CollectsList';

export const metadata: Metadata = {
  title: 'Коллекты | Совместные закупки мерча',
  description: 'Присоединяйтесь к совместным закупкам (коллектам) мерча в типографии РИФ. Дешевая печать брелоков и стендов за счет объединения тиражей художников.',
  alternates: {
    canonical: '/collects',
  },
  openGraph: {
    title: 'Коллекты мерча | Совместные заказы | Типография РИФ',
    description: 'Объединяйтесь с другими художниками для производства мерча. Больше тираж — ниже стоимость! Акриловые брелоки, стенды, значки.',
    url: '/collects',
    type: 'website',
  },
};

export default async function CollectsPage() {
  const activeCollects = await db
    .select()
    .from(collects)
    .orderBy(desc(collects.deadline));

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <BreadcrumbJsonLd items={[
        { name: "Главная", item: "/" },
        { name: "Коллекты", item: "/collects" }
      ]} />
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
              Объединяйтесь с другими авторами для производства мерча. Больший общий заказ — меньшая цена для каждого!
            </p>

            <div className="max-w-2xl mx-auto p-6 bg-theme-surface anime-border anime-shadow text-theme-text font-medium leading-relaxed mt-10 text-left">
              <span className="font-bold flex items-center gap-2 mb-2 text-theme-highlight text-lg">
                <Sparkles size={20} /> Система скидок и условия:
              </span>
              Изначальная цена чуть выше, но за каждые набранные <strong>50 000 ₽</strong> добавляется скидка <strong>5%</strong>. Максимальная скидка составляет <strong>20%</strong> (при достижении общего банка в 200 000 ₽). 
              <br/><br/>
              <span className="text-theme-muted">⚠️ Минимальный заказ — 10 шт. на один макет любого размера.</span>
            </div>
          </header>

          <CollectsList initialCollects={activeCollects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}