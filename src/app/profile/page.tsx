import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Package, Heart, Settings, LogOut, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Личный кабинет | Reef',
};

const mockOrders = [
  { id: 'ORD-2023-089', date: '12 Авг 2023', status: 'В производстве', items: 2, total: 3500 },
  { id: 'ORD-2023-042', date: '05 Июл 2023', status: 'Доставлен', items: 5, total: 12400 },
  { id: 'ORD-2023-018', date: '22 Май 2023', status: 'Доставлен', items: 1, total: 1800 },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-theme-bg manga-dots">
      <Header />

      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

            {/* Sidebar (Навигация) */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-theme-surface rounded-[40px] p-8 anime-border anime-shadow sticky top-24">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b-2 border-theme-border">
                  <div className="w-16 h-16 bg-theme-bg rounded-2xl anime-border shadow-sm flex items-center justify-center text-theme-highlight text-3xl font-black rotate-[-3deg]">
                    A
                  </div>
                  <div>
                    <h2 className="font-display font-black text-theme-text text-xl leading-tight">Author Name</h2>
                    <p className="text-theme-muted text-sm font-medium">author@example.com</p>
                  </div>
                </div>

                <nav className="space-y-3">
                  <Link href="/profile" className="flex items-center gap-3 p-4 bg-theme-highlight/10 text-theme-highlight font-bold rounded-2xl border-2 border-theme-highlight/30 shadow-sm hover:-translate-y-1 transition-all">
                    <Package size={20} strokeWidth={2.5} />
                    История заказов
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-4 text-theme-muted font-bold rounded-2xl border-2 border-transparent hover:border-theme-border hover:bg-theme-bg hover:text-theme-text hover:-translate-y-1 transition-all">
                    <Heart size={20} strokeWidth={2.5} />
                    Избранное
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-4 text-theme-muted font-bold rounded-2xl border-2 border-transparent hover:border-theme-border hover:bg-theme-bg hover:text-theme-text hover:-translate-y-1 transition-all">
                    <Settings size={20} strokeWidth={2.5} />
                    Настройки
                  </Link>
                </nav>

                <div className="mt-8 pt-8 border-t-2 border-theme-border">
                  <button className="flex items-center gap-3 p-4 w-full text-rose-500 font-bold rounded-2xl border-2 border-transparent hover:border-rose-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:-translate-y-1 transition-all">
                    <LogOut size={20} strokeWidth={2.5} />
                    Выйти
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
              
              {/* История заказов */}
              <section>
                <h1 className="text-4xl font-display font-black text-theme-text mb-8">История заказов</h1>
                <div className="bg-theme-surface rounded-[40px] p-4 sm:p-6 anime-border anime-shadow">
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="p-4 sm:p-6 rounded-[24px] bg-theme-bg border-2 border-theme-border hover:border-theme-highlight/50 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group cursor-pointer">
                        
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-theme-surface rounded-2xl flex items-center justify-center text-theme-muted border-2 border-theme-border group-hover:bg-theme-highlight group-hover:text-[var(--theme-btn-text)] group-hover:border-transparent group-hover:-translate-y-1 transition-all shadow-sm">
                            <Package size={26} strokeWidth={2.5} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="font-black text-theme-text text-xl">{order.id}</span>
                              
                              {/* Аниме-стикеры статуса */}
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] ${
                                order.status === 'Доставлен' 
                                  ? 'bg-theme-green-bg text-theme-green-text rotate-[-2deg]' 
                                  : 'bg-theme-yellow-bg text-theme-yellow-text rotate-[2deg]'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <div className="text-theme-muted font-medium text-sm flex items-center gap-2">
                              <Clock size={14} className="text-theme-highlight" /> {order.date}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-1/3">
                          <div className="text-left sm:text-right">
                            <div className="text-sm font-bold text-theme-muted mb-1">{order.items} позиций</div>
                            <div className="font-black text-xl text-theme-text">{order.total} ₽</div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-theme-surface border-2 border-theme-border flex items-center justify-center text-theme-muted group-hover:bg-theme-accent group-hover:text-[var(--theme-btn-text)] group-hover:border-transparent group-hover:shadow-[0_4px_0_0_var(--theme-btn-shadow)] group-hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">
                            <ChevronRight size={24} strokeWidth={3} />
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Мои коллекты */}
              <section>
                <h2 className="text-3xl font-display font-black text-theme-text mb-8">Мои коллекты</h2>
                <div className="bg-theme-accent rounded-[40px] p-8 md:p-10 text-[var(--theme-btn-text)] relative overflow-hidden anime-border anime-shadow">
                  {/* Паттерн точек */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--theme-btn-text)_2px,transparent_2px)] [background-size:20px_20px]" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex px-4 py-1.5 bg-theme-bg/20 rounded-full text-xs font-black uppercase tracking-wider mb-4 border-2 border-theme-bg/30 backdrop-blur-sm shadow-[2px_2px_0_0_rgba(255,255,255,0.2)] rotate-[-1deg]">
                        Сбор открыт
                      </div>
                      <h3 className="text-3xl font-display font-black mb-4 drop-shadow-sm">Брелки из эпоксидки</h3>
                      <div className="flex flex-wrap items-center gap-4 text-theme-bg/90 font-bold text-sm">
                        <span className="flex items-center gap-1.5 bg-theme-bg/10 px-3 py-1.5 rounded-lg border border-theme-bg/20">
                          <CheckCircle2 size={18} /> Макет одобрен
                        </span>
                        <span className="bg-theme-bg/10 px-3 py-1.5 rounded-lg border border-theme-bg/20">
                          Сбор до 15.10.2023
                        </span>
                      </div>
                    </div>

                    <div className="text-center bg-theme-bg/10 p-6 rounded-[24px] backdrop-blur-sm border-2 border-theme-bg/20 shadow-inner min-w-[160px]">
                      <div className="text-sm font-bold text-theme-bg/80 mb-2 uppercase tracking-wider">Собрано</div>
                      <div className="text-4xl font-black drop-shadow-md">45 <span className="text-xl text-theme-bg/70">/ 50</span></div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-10">
                    <div className="w-full bg-theme-bg/30 h-4 rounded-full overflow-hidden shadow-inner border border-theme-bg/20">
                      <div className="bg-[var(--theme-btn-text)] h-full rounded-full transition-all relative" style={{ width: '90%' }}>
                        <div className="absolute inset-0 bg-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Сохраненные идеи */}
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display font-black text-theme-text">Сохраненные идеи</h2>
                  <Link href="/portfolio" className="text-sm font-bold text-theme-highlight hover:text-theme-text transition-colors">
                    В портфолио &rarr;
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="group relative rounded-[32px] overflow-hidden bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all duration-300">
                      <div className="relative aspect-square overflow-hidden bg-theme-bg">
                        <Image
                          src={`https://picsum.photos/seed/reef${i}/400/400`}
                          alt={`Idea ${i}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 p-3 bg-theme-surface/80 backdrop-blur-md rounded-full border-2 border-theme-border shadow-sm text-rose-500 hover:scale-110 transition-transform cursor-pointer">
                          <Heart size={20} className="fill-current" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}