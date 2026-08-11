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
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white rounded-[32px] p-8 anime-border shadow-sm sticky top-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-reef-light rounded-full flex items-center justify-center text-reef-blue text-2xl font-black">
                    A
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-800 text-lg">Author Name</h2>
                    <p className="text-slate-500 text-sm">author@example.com</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  <Link href="/profile" className="flex items-center gap-3 p-4 bg-reef-light/50 text-reef-blue font-bold rounded-2xl border border-reef-blue/20">
                    <Package size={20} />
                    История заказов
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-4 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">
                    <Heart size={20} />
                    Избранное (Материалы и Идеи)
                  </Link>
                  <Link href="#" className="flex items-center gap-3 p-4 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">
                    <Settings size={20} />
                    Настройки
                  </Link>
                </nav>
                
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <button className="flex items-center gap-3 p-4 w-full text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-colors">
                    <LogOut size={20} />
                    Выйти
                  </button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              <h1 className="text-4xl font-display font-black text-slate-800">История заказов</h1>
              
              <div className="bg-white rounded-[32px] p-2 anime-border shadow-sm">
                <div className="space-y-2">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group cursor-pointer">
                      
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-reef-blue group-hover:shadow-sm transition-all">
                          <Package size={24} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-slate-800 text-lg">{order.id}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              order.status === 'Доставлен' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-slate-500 text-sm flex items-center gap-2">
                            <Clock size={14} /> {order.date}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end gap-8 sm:w-1/3">
                        <div className="text-right">
                          <div className="text-sm text-slate-500 mb-1">{order.items} позиций</div>
                          <div className="font-black text-slate-800">{order.total} ₽</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-reef-blue group-hover:text-white transition-colors">
                          <ChevronRight size={20} />
                        </div>
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Active Collects */}
              <h2 className="text-2xl font-display font-black text-slate-800 mt-12 mb-6">Мои коллекты</h2>
              <div className="bg-gradient-to-r from-reef-blue to-reef-dark rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/30">
                      Сбор открыт
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Брелки из эпоксидки (Октябрь)</h3>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                      <span className="flex items-center gap-1"><CheckCircle2 size={16} /> Макет одобрен</span>
                      <span>Сбор до 15.10.2023</span>
                    </div>
                  </div>
                  
                  <div className="text-center bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20 min-w-[140px]">
                    <div className="text-sm font-medium text-white/70 mb-1">Собрано</div>
                    <div className="text-3xl font-black">45 / 50</div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-reef-cyan h-full rounded-full shadow-[0_0_10px_rgba(75,211,229,0.8)]" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>

              {/* Liked Portfolio Items */}
              <div className="flex items-center justify-between mt-12 mb-6">
                <h2 className="text-2xl font-display font-black text-slate-800">Сохраненные идеи</h2>
                <Link href="/portfolio" className="text-sm font-bold text-reef-blue hover:text-reef-dark">В портфолио</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="group relative rounded-2xl overflow-hidden bg-white anime-border anime-shadow hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                      <Image
                        src={`https://picsum.photos/seed/reef${i}/400/400`}
                        alt={`Idea ${i}`}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm text-red-500">
                        <Heart size={16} className="fill-current" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
            </div>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
