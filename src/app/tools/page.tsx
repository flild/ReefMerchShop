import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckSquare, MonitorPlay, FileSearch, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Инструменты | Reef',
  description: 'Полезные утилиты для подготовки макетов. Генератор мокапов, чек-листы и валидатор.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.ru'}/tools`,
  },
};

const tools = [
  {
    id: 'mockup',
    title: '3D превью акрила',
    description: 'Загрузите ваш макет без фона (PNG), чтобы увидеть, как он будет смотреться в готовом изделии.',
    icon: MonitorPlay,
    colorClasses: 'bg-theme-highlight text-[var(--theme-btn-text)]',
    href: '/tools/mockup',
  },
  {
    id: 'checklist',
    title: 'Генератор чек-листа',
    description: 'Соберите индивидуальный список проверок для вашего макета перед отправкой в тираж.',
    icon: CheckSquare,
    colorClasses: 'bg-theme-accent text-[var(--theme-btn-text)]',
    href: '/tools/checklist',
  },
  {
    id: 'check',
    title: 'Валидатор макетов',
    description: 'Автоматическая проверка PSD/TIFF файлов на правильность подготовки слоев и разрешения.',
    icon: FileSearch,
    colorClasses: 'bg-theme-text text-theme-bg',
    href: '/tools/check',
  }
];

export default function ToolsIndexPage() {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": "https://reef.ru/" },
      { "@type": "ListItem", "position": 2, "name": "Инструменты", "item": "https://reef.ru/tools" }
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
            <span className="text-theme-text" aria-current="page">Инструменты</span>
          </nav>

          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full anime-border mb-6 text-theme-highlight font-bold text-sm tracking-wide shadow-[2px_2px_0_0_var(--theme-border)] rotate-[1deg]">
              <Sparkles size={16} />
              В помощь авторам
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-theme-text mb-8 drop-shadow-sm">Инструменты</h1>
            <p className="text-xl md:text-2xl text-theme-muted max-w-3xl mx-auto font-medium leading-relaxed">
              Специальные утилиты, которые помогут вам правильно подготовить макеты к печати и избежать брака.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="bg-theme-surface rounded-[40px] p-8 anime-border anime-shadow group hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-transform anime-border ${tool.colorClasses}`}>
                  <tool.icon size={32} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-theme-text mb-4">{tool.title}</h3>
                <p className="text-theme-muted font-medium mb-8 flex-1 leading-relaxed">{tool.description}</p>

                <div className="flex items-center gap-2 text-theme-highlight font-black mt-auto uppercase tracking-wider text-sm group-hover:gap-4 transition-all">
                  Открыть <ArrowRight size={18} strokeWidth={3} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}