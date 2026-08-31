'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Users, Calendar, ArrowRight, Percent, Wallet } from 'lucide-react';
import { calculateDiscount } from '../../lib/collects';

interface Collect {
  id: string;
  title: string;
  description: string;
  minCount: number;
  currentCount: number;
  currentSum: number;
  targetSumLimit: number;
  deadline: Date;
  productionDate: string;
}

export function CollectsSection({ items }: { items: Collect[] }) {
  if (!items.length) return null;

  return (
    <section className="py-24 bg-theme-bg relative border-t-4 border-theme-border overflow-hidden manga-dots">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-theme-accent text-theme-surface font-black px-4 py-1 rounded-full border-2 border-theme-border mb-4 anime-shadow rotate-2">
             Горящие сборы
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6">Впишись в коллект</h2>
          <p className="text-xl text-theme-muted max-w-2xl mx-auto font-medium">
            Объединяемся, чтобы печатать мерч дешевле. Больше общий банк — выше скидка для всех.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((collect, i) => {
            // Прогресс теперь считаем по деньгам, как и на основной странице
            const progress = Math.min(100, (collect.currentSum / collect.targetSumLimit) * 100);
            const currentDiscount = calculateDiscount(collect.currentSum);
            
            return (
              <motion.div 
                key={collect.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-theme-surface rounded-[40px] p-8 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col group"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-2xl font-black text-theme-text uppercase">{collect.title}</h3>
                  <div className="bg-theme-bg px-3 py-1 rounded-full border-2 border-theme-border text-theme-highlight font-extrabold flex items-center gap-1 shrink-0">
                    <Percent size={16} /> {currentDiscount}%
                  </div>
                </div>
                
                <p className="text-theme-muted mb-6 font-medium line-clamp-2">{collect.description}</p>
                
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-theme-text font-bold">
                    <Calendar className="text-theme-accent" size={24} />
                    <span>Сбор до {new Date(collect.deadline).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-theme-text font-bold">
                    <Wallet className="text-theme-accent" size={24} />
                    <span>Банк: {collect.currentSum.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex items-center gap-3 text-theme-text font-bold opacity-75">
                    <Users className="text-theme-accent" size={20} />
                    <span className="text-sm">Собрано позиций: {collect.currentCount} из {collect.minCount} шт.</span>
                  </div>
                </div>

                {/* Прогресс-бар в манга-стиле (до 200к) */}
                <div className="w-full h-6 bg-theme-bg rounded-full border-2 border-theme-border overflow-hidden mb-6 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="h-full bg-theme-accent border-r-2 border-theme-border relative overflow-hidden"
                  >
                    {/* Блики на прогресс-баре */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-white/30" />
                  </motion.div>
                </div>

                {/* Пока ссылка ведет на общую страницу коллектов, так как публичной деталки у нас еще нет */}
                <Link 
                  href={`/collects/${collect.id}/join`}
                  className="w-full py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 relative z-10 bg-theme-surface text-theme-text hover:text-theme-highlight anime-border border-2 shadow-[0_6px_0_0_var(--theme-shadow-base)] hover:shadow-[0_4px_0_0_var(--theme-shadow-base)] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all"
                >
                  Участвовать <ArrowRight size={24} strokeWidth={3} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}