import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Package, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Коллекты | Reef',
  description: 'Совместные заказы художников для снижения стоимости.',
};

export default function CollectsPage() {
  const collects = [
    {
      id: '1',
      title: 'СЕНТЯБРЬСКИЙ КОЛЛЕКТ',
      description: 'Массовый заказ на печать брелоков и стендов из прозрачного акрила 3мм.',
      deadline: '15 сентября',
      production: '20–25 сентября',
      minCount: 50,
      currentCount: 17,
      status: 'Открыт',
      priceDesc: 'от 35 ₽ / шт'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 py-24 bg-white manga-dots">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-reef-light rounded-full anime-border mb-6 text-reef-blue font-bold text-sm tracking-wide">
              <Sparkles size={16} />
              Совместные закупки
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-slate-800 mb-8 drop-shadow-sm">Коллекты</h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mb-6">
              Объединяйтесь с другими авторами для производства мерча. Больший общий тираж — меньшая цена для каждого!
            </p>
            <div className="max-w-2xl mx-auto p-5 bg-blue-50/50 border-2 border-blue-100 rounded-[24px] text-blue-800 font-medium leading-relaxed">
              <span className="font-bold block mb-2">🔥 Система скидок:</span>
              При общем заказе от 50 тыс. руб. добавляется скидка 5%, и за каждые 50 тыс. добавляется также 5%, но максимальная скидка 15% (то есть 150к надо набрать для макс. скидки).
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {collects.map((collect) => (
              <div key={collect.id} className="bg-white rounded-[40px] p-8 md:p-12 anime-border anime-shadow flex flex-col md:flex-row gap-10 relative overflow-hidden group hover:anime-shadow-hover hover:-translate-y-2 transition-all">
                <div className="absolute top-0 right-0 w-80 h-80 bg-reef-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:bg-reef-cyan/20 transition-colors" />
                
                <div className="flex-1 z-10">
                  <div className="inline-flex px-5 py-2 bg-[#e0f7fa] text-[#00838f] font-black rounded-full text-sm uppercase tracking-widest mb-6 anime-border border-[#00bcd4]/30 shadow-sm">
                    {collect.status}
                  </div>
                  
                  <h2 className="text-4xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">{collect.title}</h2>
                  <p className="text-xl text-slate-600 mb-10 max-w-xl font-medium">{collect.description}</p>
                  
                  <div className="flex flex-wrap gap-8 text-lg font-bold text-slate-700 bg-reef-light/50 p-6 rounded-[32px] anime-border border-reef-blue/10">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl anime-border shadow-sm text-reef-blue">
                        <Clock size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider">Прием заказов до</div>
                        <div className="text-reef-dark">{collect.deadline}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl anime-border shadow-sm text-reef-blue">
                        <Package size={24} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500 mb-1 uppercase tracking-wider">Готовность по СПб</div>
                        <div className="text-reef-dark">{collect.production}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-96 bg-reef-blue rounded-[32px] p-8 border-4 border-reef-dark z-10 flex flex-col justify-between text-white shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 font-black text-lg">
                        <Users size={24} strokeWidth={2.5} />
                        Участники
                      </div>
                      <div className="font-black text-xl bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
                        {collect.currentCount} / {collect.minCount}
                      </div>
                    </div>
                    
                    <div className="w-full bg-reef-dark/50 h-4 rounded-full mb-8 overflow-hidden shadow-inner border border-reef-dark">
                      <div 
                        className="bg-reef-cyan h-full rounded-full transition-all shadow-[0_0_10px_rgba(75,211,229,0.8)]"
                        style={{ width: `${Math.min(100, (collect.currentCount / collect.minCount) * 100)}%` }}
                      />
                    </div>
                    
                    <div className="text-center mb-8 bg-white/10 p-6 rounded-3xl backdrop-blur-sm border border-white/20">
                      <div className="text-sm font-bold opacity-90 mb-2 uppercase tracking-wider">Цена участника</div>
                      <div className="text-4xl font-display font-black text-reef-cyan drop-shadow-md">{collect.priceDesc}</div>
                    </div>
                  </div>
                  
                  <button className="w-full py-5 bg-white text-reef-blue rounded-[24px] font-black text-xl transition-all shadow-[0_6px_0_0_#093f8e] active:shadow-[0_0px_0_0_#093f8e] active:translate-y-[6px] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#093f8e] flex items-center justify-center gap-3 relative z-10">
                    Участвовать <ArrowRight size={24} strokeWidth={3} />
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
