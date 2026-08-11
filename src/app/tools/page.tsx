import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckSquare, MonitorPlay, FileSearch, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Инструменты | Reef',
  description: 'Полезные утилиты для подготовки макетов',
};

const tools = [
  {
    id: 'mockup',
    title: '3D превью акрила',
    description: 'Загрузите ваш макет без фона (PNG), чтобы увидеть, как он будет смотреться в готовом изделии.',
    icon: MonitorPlay,
    color: 'bg-reef-cyan text-white',
    href: '/tools/mockup',
  },
  {
    id: 'checklist',
    title: 'Генератор чек-листа',
    description: 'Соберите индивидуальный список проверок для вашего макета перед отправкой в тираж.',
    icon: CheckSquare,
    color: 'bg-reef-blue text-white',
    href: '/tools/checklist',
  },
  {
    id: 'check',
    title: 'Валидатор макетов',
    description: 'Автоматическая проверка PSD/TIFF файлов на правильность подготовки слоев и разрешения.',
    icon: FileSearch,
    color: 'bg-purple-500 text-white',
    href: '/tools/check',
  }
];

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 py-24 bg-reef-light manga-dots">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full anime-border mb-6 text-reef-blue font-bold text-sm tracking-wide shadow-sm">
              <Sparkles size={16} />
              В помощь авторам
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-800 mb-8 drop-shadow-sm">Инструменты</h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Специальные утилиты, которые помогут вам правильно подготовить макеты к печати и избежать брака.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool) => (
              <Link key={tool.id} href={tool.href} className="bg-white rounded-[40px] p-8 anime-border anime-shadow group hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-8 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform ${tool.color}`}>
                  <tool.icon size={32} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{tool.title}</h3>
                <p className="text-slate-600 font-medium mb-8 flex-1">{tool.description}</p>
                
                <div className="flex items-center gap-2 text-reef-blue font-black mt-auto uppercase tracking-wider text-sm group-hover:gap-4 transition-all">
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
