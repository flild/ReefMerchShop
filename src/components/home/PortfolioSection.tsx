'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  authorName: string | null;
}

interface PortfolioSectionProps {
  items: PortfolioItem[];
}

export function PortfolioSection({ items }: PortfolioSectionProps) {
  if (!items || items.length === 0) return null;

  // Функция для вычисления размера карточки в сетке
  const getGridClasses = (index: number) => {
    // Делаем 1-ю и 6-ю работы крупными (занимают 2 колонки и 2 строки)
    if (index === 0 || index === 5) {
      return 'col-span-1 sm:col-span-2 row-span-2';
    }
    // 4-я работа занимает 2 колонки в ширину
    if (index === 3) {
      return 'col-span-1 sm:col-span-2 row-span-1';
    }
    return 'col-span-1 row-span-1';
  };

  return (
    <section className="py-24 bg-theme-surface border-t-4 border-theme-border overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 max-w-6xl mx-auto gap-6"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-4 drop-shadow-sm">Свежие работы</h2>
            <p className="text-xl text-theme-muted font-medium">То, что мы напечатали совсем недавно</p>
          </div>
          <Link href="/portfolio" className="anime-button px-6 py-3 flex items-center gap-2 whitespace-nowrap">
            Смотреть витрину
            <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto auto-rows-[250px]">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={`group relative rounded-3xl overflow-hidden bg-theme-bg anime-border anime-shadow hover:-translate-y-1 hover:anime-shadow-hover transition-all duration-300 flex flex-col cursor-pointer ${getGridClasses(index)}`}
            >
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.imageUrl || `https://picsum.photos/seed/${item.id}/800/800`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Градиентная подложка для читаемости текста */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-20 mt-auto p-6 flex flex-col justify-end h-full">
                <h3 className="font-black text-xl text-white mb-1 line-clamp-2 drop-shadow-md">
                  {item.title}
                </h3>
                {item.authorName && (
                  <p className="text-reef-cyan font-bold text-sm drop-shadow-sm">
                    Арт: {item.authorName}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}