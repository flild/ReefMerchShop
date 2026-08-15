'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface MaterialItem {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  stock: number;
  minStock: number;
  inStock: boolean;
}

interface MaterialsSectionProps {
  items: MaterialItem[];
}

export function MaterialsSection({ items }: MaterialsSectionProps) {
  if (!items || items.length === 0) return null;

  const getStockStatus = (material: MaterialItem) => {
    if (!material.inStock || material.stock <= 0) {
      return { 
        label: 'Нет в наличии', 
        classes: 'bg-theme-gray-bg text-theme-gray-text' 
      };
    }
    if (material.stock <= material.minStock) {
      return { 
        label: 'Осталось мало', 
        classes: 'bg-theme-yellow-bg text-theme-yellow-text' 
      };
    }
    return { 
      label: 'В наличии', 
      classes: 'bg-theme-green-bg text-theme-green-text' 
    };
  };

  return (
    <section className="py-24 bg-theme-bg manga-dots border-t-4 border-theme-border overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 drop-shadow-sm">Море материалов</h2>
          <p className="text-xl text-theme-muted max-w-2xl mx-auto font-medium">От классического прозрачного акрила до переливающегося жемчуга</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((mat, index) => {
            const status = getStockStatus(mat);
            
            return (
              <motion.div 
                key={mat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-theme-surface rounded-[32px] p-6 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col group relative cursor-pointer"
              >
                {/* Бейдж статуса в виде стикера */}
                <div className={`absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-black border-2 border-theme-border shadow-[3px_3px_0_0_var(--theme-border)] rotate-[-3deg] ${status.classes}`}>
                  {status.label}
                </div>

                <div className="aspect-square rounded-2xl overflow-hidden mb-6 border-2 border-theme-border relative bg-theme-bg">
                  <Image
                    src={mat.imageUrl || `https://picsum.photos/seed/${mat.id}/400/400`}
                    alt={mat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-black text-theme-text mb-2">{mat.name}</h3>
                {mat.description && <p className="text-theme-muted text-sm line-clamp-3 mt-auto">{mat.description}</p>}
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/materials" className="anime-button-alt px-8 py-4 inline-flex items-center gap-3 text-lg bg-theme-surface border-2 border-theme-border rounded-full font-bold text-theme-text hover:bg-theme-bg transition-colors shadow-[0_4px_0_0_var(--theme-border)] active:translate-y-1 active:shadow-none group">
            Весь каталог материалов
            <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}