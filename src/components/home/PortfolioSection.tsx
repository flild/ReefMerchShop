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
            Смотреть всё
            <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative rounded-3xl overflow-hidden bg-theme-surface anime-border anime-shadow hover:-translate-y-2 hover:anime-shadow-hover transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-theme-bg border-b-4 border-theme-border">
                <Image
                  src={item.imageUrl || `https://picsum.photos/seed/${item.id}/600/600`}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 bg-theme-surface flex-1 flex flex-col">
                <h3 className="font-black text-lg text-theme-text mb-1 line-clamp-2">{item.title}</h3>
                {item.authorName && <p className="text-reef-cyan font-bold text-sm mt-auto">Арт: {item.authorName}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}