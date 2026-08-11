import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Download, FileDown, Layers, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Шаблоны | Reef',
  description: 'Скачайте шаблоны для подготовки макетов к печати.',
};

export default function TemplatesPage() {
  const templates = [
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
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-800 mb-8 drop-shadow-sm">Шаблоны</h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
              Используйте готовые шаблоны для подготовки макетов. Это ускорит проверку и исключит технические ошибки!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {templates.map(template => (
              <div key={template.id} className="bg-white rounded-[40px] p-10 anime-border anime-shadow group hover:anime-shadow-hover hover:-translate-y-2 transition-all">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="inline-block px-4 py-1 bg-reef-light rounded-full text-sm font-black text-reef-blue tracking-widest uppercase mb-4 border border-reef-blue/20 shadow-sm">
                      {template.product}
                    </div>
                    <h3 className="text-3xl font-display font-black text-slate-800">{template.title}</h3>
                  </div>
                  <div className="w-16 h-16 bg-reef-blue text-white rounded-3xl flex items-center justify-center shadow-[0_4px_0_0_#093f8e] group-hover:scale-110 group-hover:rotate-6 transition-transform">
                    <Layers size={32} strokeWidth={2.5} />
                  </div>
                </div>
                
                <p className="text-lg text-slate-600 mb-10 font-medium">{template.description}</p>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    {template.formats.map(format => (
                      <button key={format} className="px-5 py-3 bg-white hover:bg-reef-light rounded-2xl text-sm font-bold text-reef-blue flex items-center gap-2 border-2 border-reef-blue/20 transition-colors shadow-sm hover:-translate-y-0.5">
                        <FileDown size={18} strokeWidth={3} />
                        {format}
                      </button>
                    ))}
                  </div>
                  
                  <button className="w-full py-4 bg-reef-blue text-white rounded-[24px] font-black text-lg transition-all shadow-[0_4px_0_0_#093f8e] active:shadow-[0_0px_0_0_#093f8e] active:translate-y-[4px] hover:-translate-y-1 hover:shadow-[0_6px_0_0_#093f8e] flex items-center justify-center gap-3">
                    <Download size={24} strokeWidth={3} />
                    Скачать весь архив (ZIP)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
