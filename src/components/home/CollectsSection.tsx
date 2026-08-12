'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Users, Calendar, ArrowRight } from 'lucide-react';

interface Collect {
  id: string;
  title: string;
  description: string;
  minCount: number;
  currentCount: number;
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
            Объединяемся, чтобы печатать мерч дешевле. Меньше минималок, больше выгоды.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {items.map((collect, i) => {
            const progress = Math.min((collect.currentCount / collect.minCount) * 100, 100);
            
            return (
              <motion.div 
                key={collect.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-theme-surface rounded-[40px] p-8 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col group"
              >
                <h3 className="text-2xl font-black text-theme-text mb-2 uppercase">{collect.title}</h3>
                <p className="text-theme-muted mb-6 font-medium line-clamp-2">{collect.description}</p>
                
                <div className="space-y-4 mb-8 flex-1">
                  <div className="flex items-center gap-3 text-theme-text font-bold">
                    <Calendar className="text-theme-accent" size={24} />
                    <span>Сбор до {new Date(collect.deadline).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-theme-text font-bold">
                    <Users className="text-theme-accent" size={24} />
                    <span>Собрано: {collect.currentCount} из {collect.minCount} шт.</span>
                  </div>
                </div>

                {/* Прогресс-бар в манга-стиле */}
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

                <Link href={`/collects/${collect.id}`} className="anime-button w-full py-4 text-center text-lg flex items-center justify-center gap-2 group-hover:-translate-y-1 transition-transform">
                  Участвовать 
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}