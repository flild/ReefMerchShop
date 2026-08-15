import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { db } from '@/db';
import { materials, accessories } from '@/db/schema';
import { MaterialsList } from '@/components/materials/MaterialsList';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Материалы и наличие',
  description: 'Каталог акрила и фурнитуры для производства мерча. Актуальное наличие обновляется автоматически.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.ru'}/materials`,
  },
};

export default async function MaterialsPage() {
  const allMaterials = await db.select().from(materials).orderBy(materials.name);
  const allAccessories = await db.select().from(accessories).orderBy(accessories.name);

  const acrylics = allMaterials.filter((m) => m.type === 'acrylic');
  const holography = allMaterials.filter((m) => m.type === 'holography');

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://reef.ru/" },
      { "@type": "ListItem", "position": 2, "name": "Материалы", "item": "https://reef.ru/materials" }
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
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">Материалы</span>
          </nav>

          <header className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full anime-border mb-6 text-theme-highlight font-bold text-sm tracking-wide shadow-sm">
              <Sparkles size={16} />
              Каталог материалов
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-theme-text mb-8 drop-shadow-sm">
              Материалы и фурнитура
            </h1>
            <p className="text-xl md:text-2xl text-theme-muted max-w-3xl mx-auto font-medium leading-relaxed">
              Всё необходимое для вашего мерча. Мы регулярно пополняем запасы, актуальное наличие обновляется автоматически.
            </p>
          </header>

          <MaterialsList 
            acrylics={acrylics} 
            holography={holography} 
            accessoriesData={allAccessories} 
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}