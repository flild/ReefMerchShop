import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Download, FileDown, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { db } from '@/db';
import { templates } from '@/db/schema';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Шаблоны',
  description: 'Скачайте шаблоны для подготовки макетов к печати. PSD, AI, PDF форматы для акриловых брелоков и стендов.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.ru'}/templates`,
  },
};

const mockTemplates = [
  {
    id: '1',
    title: 'Брелок 50x50 мм',
    description: 'Стандартный шаблон с контуром резки и отверстием.',
    product: 'Акриловый брелок',
    formats: ['PSD', 'AI', 'PDF', 'CDR']
  },
  {
    id: '2',
    title: 'Стенд 100x150 мм',
    description: 'Шаблон стенда с базой и одним пазом.',
    product: 'Акриловый стенд',
    formats: ['PSD', 'AI']
  },
  {
    id: '3',
    title: 'Значок 40x40 мм',
    description: 'Шаблон под заливку смолой и булавку.',
    product: 'Значок',
    formats: ['PSD', 'AI', 'PDF']
  }
];

export default async function TemplatesPage() {
  let templatesData: any[] = [];

  try {
    templatesData = await db.select().from(templates);
  } catch (error) {
    console.error('Ошибка загрузки шаблонов из БД:', error);
  }

  // Если БД пустая (например, еще не заполнили через админку), показываем моки
  const displayTemplates = templatesData.length > 0 ? templatesData : mockTemplates;

  // SEO микроразметка
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://reef.ru/" },
      { "@type": "ListItem", "position": 2, "name": "Шаблоны", "item": "https://reef.ru/templates" }
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
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          
          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">Шаблоны</span>
          </nav>

          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full anime-border mb-6 text-theme-highlight font-bold text-sm tracking-wide shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
              В помощь авторам
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-theme-text mb-8 drop-shadow-sm">
              Шаблоны
            </h1>
            <p className="text-xl md:text-2xl text-theme-muted max-w-3xl mx-auto font-medium leading-relaxed">
              Используйте готовые шаблоны для подготовки макетов. Это ускорит проверку и исключит технические ошибки!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {displayTemplates.map((template) => {
              // Обработка форматов на случай, если из БД они приходят строкой (JSON)
              let formatsArray = [];
              if (Array.isArray(template.formats)) {
                formatsArray = template.formats;
              } else if (typeof template.formats === 'string') {
                try { formatsArray = JSON.parse(template.formats); } 
                catch { formatsArray = template.formats.split(',').map((s: string) => s.trim()); }
              }

              return (
                <div key={template.id} className="bg-theme-surface rounded-[40px] p-8 md:p-10 anime-border anime-shadow group hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col">
                  
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="inline-block px-4 py-1.5 bg-theme-bg rounded-full text-xs font-black text-theme-highlight tracking-widest uppercase mb-4 border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[1deg]">
                        {template.product || 'Шаблон'}
                      </div>
                      <h3 className="text-3xl font-display font-black text-theme-text leading-tight">{template.title}</h3>
                    </div>
                    
                    <div className="w-16 h-16 shrink-0 bg-theme-accent text-[var(--theme-btn-text)] rounded-3xl flex items-center justify-center shadow-[0_4px_0_0_var(--theme-btn-shadow)] group-hover:scale-110 group-hover:rotate-6 transition-transform anime-border ml-4">
                      <Layers size={32} strokeWidth={2.5} />
                    </div>
                  </div>

                  <p className="text-lg text-theme-muted mb-10 font-medium flex-1">
                    {template.description}
                  </p>

                  <div className="space-y-6 mt-auto">
                    <div className="flex flex-wrap gap-3">
                      {formatsArray.map((format: string) => (
                        <button key={format} className="px-5 py-3 bg-theme-bg hover:bg-theme-highlight/10 rounded-2xl text-sm font-bold text-theme-highlight flex items-center gap-2 border-2 border-theme-border hover:border-theme-highlight/50 transition-all shadow-sm hover:-translate-y-1">
                          <FileDown size={18} strokeWidth={3} />
                          {format}
                        </button>
                      ))}
                    </div>

                    <button className="anime-button w-full py-4 rounded-[24px] font-black text-lg flex items-center justify-center gap-3">
                      <Download size={24} strokeWidth={3} />
                      Скачать архив
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}