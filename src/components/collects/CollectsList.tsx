'use client';

import { motion } from 'motion/react';
import { Package, Clock, Users, ArrowRight } from 'lucide-react';
import type { InferSelectModel } from 'drizzle-orm';
import { collects } from '@/db/schema';

// Строгая типизация через схему БД
type Collect = InferSelectModel<typeof collects>;

interface CollectsListProps {
  initialCollects: Collect[];
}

export function CollectsList({ initialCollects }: CollectsListProps) {
  if (initialCollects.length === 0) {
    return (
      <div className="text-center py-12 bg-theme-surface anime-border rounded-[40px] anime-shadow">
        <p className="text-xl text-theme-muted font-medium">В данный момент нет открытых коллектов.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12">
      {initialCollects.map((collect, index) => {
        const progress = Math.min(100, (collect.currentCount / collect.minCount) * 100);
        
        // Форматирование даты
        const formattedDeadline = new Intl.DateTimeFormat('ru-RU', { 
          day: 'numeric', 
          month: 'long' 
        }).format(new Date(collect.deadline));

        return (
          <motion.div
            key={collect.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-theme-surface rounded-[40px] p-8 md:p-12 anime-border anime-shadow flex flex-col md:flex-row gap-10 relative overflow-hidden group hover:anime-shadow-hover hover:-translate-y-2 transition-all"
          >
            {/* Декоративный паттерн под тему */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-theme-accent opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:opacity-10 transition-opacity" />

            <div className="flex-1 z-10">
              <div className="inline-flex px-5 py-2 bg-theme-bg text-theme-highlight font-black rounded-full text-sm uppercase tracking-widest mb-6 anime-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
                {collect.status === 'open' ? 'Открыт' : 'Завершен'}
              </div>

              <h2 className="text-4xl font-display font-black text-theme-text mb-6 drop-shadow-sm">
                {collect.title}
              </h2>
              <p className="text-xl text-theme-muted mb-10 max-w-xl font-medium">
                {collect.description}
              </p>

              <div className="flex flex-wrap gap-8 text-lg font-bold text-theme-text bg-theme-bg p-6 rounded-[32px] anime-border">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-theme-surface rounded-2xl anime-border shadow-sm text-theme-highlight">
                    <Clock size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-sm text-theme-muted mb-1 uppercase tracking-wider">Прием заказов до</div>
                    <div className="text-theme-text">{formattedDeadline}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-theme-surface rounded-2xl anime-border shadow-sm text-theme-highlight">
                    <Package size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-sm text-theme-muted mb-1 uppercase tracking-wider">Готовность</div>
                    <div className="text-theme-text">{collect.productionDate}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-96 bg-theme-accent rounded-[32px] p-8 anime-border z-10 flex flex-col justify-between text-[var(--theme-btn-text)] anime-shadow relative overflow-hidden">
              {/* Фоновые точки используют цвет текста кнопки (белые на синем фоне, темные на светлом) */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--theme-btn-text)_2px,transparent_2px)] [background-size:20px_20px]" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 font-black text-lg">
                    <Users size={24} strokeWidth={2.5} />
                    Участники
                  </div>
                  <div className="font-black text-xl bg-theme-bg/30 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    {collect.currentCount} / {collect.minCount}
                  </div>
                </div>

                <div className="w-full bg-theme-bg/30 h-4 rounded-full mb-8 overflow-hidden shadow-inner border border-theme-bg/20">
                  <div 
                    className="bg-[var(--theme-btn-text)] h-full rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="text-center mb-8 bg-theme-bg/10 p-6 rounded-3xl backdrop-blur-sm border border-theme-bg/20 shadow-sm">
                  <div className="text-sm font-bold opacity-90 mb-2 uppercase tracking-wider">Статус сбора</div>
                  <div className="text-2xl font-display font-black drop-shadow-md">
                    {progress >= 100 ? 'Цель достигнута' : 'В процессе'}
                  </div>
                </div>
              </div>

              {/* Кастомная кнопка участия, адаптированная под акцентный фон */}
              <button className="w-full py-5 rounded-[24px] font-black text-xl flex items-center justify-center gap-3 relative z-10 bg-theme-surface text-theme-text hover:text-theme-highlight anime-border border-2 shadow-[0_6px_0_0_var(--theme-shadow-base)] hover:shadow-[0_4px_0_0_var(--theme-shadow-base)] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all">
                Участвовать <ArrowRight size={24} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}