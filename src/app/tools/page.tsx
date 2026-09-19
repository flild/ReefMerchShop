import { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { CheckSquare, MonitorPlay, FileSearch, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Инструменты для подготовки макетов к печати | РИФ',
  description: 'Бесплатные утилиты для художников: генератор мокапов мерча, чек-листы проверки макетов и инструменты валидации от типографии РИФ.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Инструменты для художников | Типография РИФ',
    description: 'Генератор мокапов, чек-листы и другие полезные инструменты для правильной подготовки макетов.',
    url: '/tools',
    type: 'website',
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
    comingSoon: true,
  },
  {
    id: 'checklist',
    title: 'Генератор чек-листа',
    description: 'Соберите индивидуальный список проверок для вашего макета перед отправкой в тираж.',
    icon: CheckSquare,
    colorClasses: 'bg-theme-accent text-[var(--theme-btn-text)]',
    href: '/tools/checklist',
    comingSoon: false,
  },
  {
    id: 'check',
    title: 'Валидатор макетов',
    description: 'Автоматическая проверка PSD/TIFF файлов на правильность подготовки слоев и разрешения.',
    icon: FileSearch,
    colorClasses: 'bg-theme-text text-theme-bg',
    href: '/tools/check',
    comingSoon: true,
  }
];

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <BreadcrumbJsonLd items={[
        { name: "Главная", item: "/" },
        { name: "Инструменты", item: "/tools" }
      ]} />
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
              <Link key={tool.id} href={tool.comingSoon ? '#' : tool.href} className={`bg-theme-surface rounded-[40px] p-8 anime-border anime-shadow group transition-all flex flex-col relative overflow-hidden ${tool.comingSoon ? 'opacity-70 grayscale cursor-not-allowed hover:-translate-y-0' : 'hover:-translate-y-2 hover:anime-shadow-hover'}`}>
                {tool.comingSoon && (
                  <div className="absolute top-6 right-6 bg-theme-bg text-theme-text font-bold text-xs px-3 py-1 rounded-full border-2 border-theme-border z-10 shadow-sm">
                    Скоро...
                  </div>
                )}
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-sm transition-transform anime-border ${tool.colorClasses} ${!tool.comingSoon && 'group-hover:scale-110 group-hover:-rotate-6'}`}>
                  <tool.icon size={32} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-bold text-theme-text mb-4">{tool.title}</h3>
                <p className="text-theme-muted font-medium mb-8 flex-1 leading-relaxed">{tool.description}</p>

                <div className={`flex items-center gap-2 font-black mt-auto uppercase tracking-wider text-sm transition-all ${tool.comingSoon ? 'text-theme-muted' : 'text-theme-highlight group-hover:gap-4'}`}>
                  {tool.comingSoon ? 'В разработке' : (
                    <>
                      Открыть <ArrowRight size={18} strokeWidth={3} />
                    </>
                  )}
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
