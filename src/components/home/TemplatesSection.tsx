'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Download, FileImage, ArrowRight } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string | null;
  size: string | null;
  productType: string | null;
  formatsJson: string; // JSON строка
}

export function TemplatesSection({ items }: { items: Template[] }) {
  if (!items.length) return null;

  return (
    <section className="py-24 bg-theme-surface relative border-t-4 border-theme-border">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 max-w-6xl mx-auto gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-4 drop-shadow-sm">Шаблоны макетов</h2>
            <p className="text-xl text-theme-muted font-medium">Качайте исходники с правильными вылетами и слоями</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/tools/checklist" className="anime-button-alt px-6 py-3 flex items-center gap-2 whitespace-nowrap border-2 border-theme-border">
              Все шаблоны
              <ArrowRight size={20} strokeWidth={3} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {items.map((tpl, index) => {
            let formats = [];
            try {
              formats = JSON.parse(tpl.formatsJson);
            } catch (e) {}

            return (
              <motion.div 
                key={tpl.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-theme-bg rounded-[32px] p-6 anime-border anime-shadow flex flex-col group hover:-translate-y-2 hover:anime-shadow-hover transition-all"
              >
                <div className="w-16 h-16 bg-theme-surface rounded-2xl border-2 border-theme-border flex items-center justify-center text-reef-cyan mb-6 shadow-sm group-hover:rotate-6 transition-transform">
                  <FileImage size={32} />
                </div>
                
                <h3 className="text-xl font-black text-theme-text mb-2">{tpl.title}</h3>
                <p className="text-theme-muted text-sm font-medium mb-4 flex-1">{tpl.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {formats.map((f: any, i: number) => (
                    <span key={i} className="text-xs font-bold px-2 py-1 bg-theme-surface border border-theme-border rounded-md text-theme-text">
                      {f.format}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-theme-surface border-2 border-theme-border rounded-xl font-bold text-theme-text flex justify-center items-center gap-2 hover:bg-reef-cyan hover:text-slate-900 transition-colors shadow-sm active:scale-95">
                  <Download size={20} />
                  Скачать ZIP
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}