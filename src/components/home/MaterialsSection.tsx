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
}

interface MaterialsSectionProps {
  items: MaterialItem[];
}

export function MaterialsSection({ items }: MaterialsSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 bg-reef-light manga-dots border-t-4 border-slate-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">Море материалов</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">От классического прозрачного акрила до переливающегося жемчуга</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((mat, index) => (
            <motion.div 
              key={mat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-[32px] p-6 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 border-2 border-slate-200 relative bg-slate-100">
                <Image
                  src={mat.imageUrl || `https://picsum.photos/seed/${mat.id}/400/400`}
                  alt={mat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{mat.name}</h3>
              {mat.description && <p className="text-slate-600 text-sm line-clamp-3 mt-auto">{mat.description}</p>}
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/materials" className="anime-button-alt px-8 py-4 inline-flex items-center gap-3 text-lg bg-white group">
            Весь каталог материалов
            <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}