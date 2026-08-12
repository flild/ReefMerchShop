'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export function CtaSection() {
  return (
    <section className="py-24 bg-theme-surface relative overflow-hidden border-t-4 border-theme-border">
      <div className="absolute inset-0 manga-dots opacity-20 pointer-events-none" />
      
      {/* Декоративные круги на фоне */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-theme-bg rounded-full blur-3xl pointer-events-none"
      />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-display font-black text-theme-text mb-8 drop-shadow-md leading-tight"
        >
          Готовы напечатать <br/>свой первый тираж?
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-theme-muted max-w-2xl mx-auto font-medium mb-12"
        >
          Напишите нам, и мы с радостью поможем подготовить макеты, подобрать лучшие материалы и запустим заказ в работу!
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex flex-wrap justify-center gap-6"
        >
          <Link href="/calculator" className="bg-theme-accent text-theme-surface px-10 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-transform shadow-[0_8px_0_0_var(--theme-btn-shadow)] hover:shadow-[0_4px_0_0_var(--theme-btn-shadow)] hover:translate-y-1 active:shadow-[0_0px_0_0_var(--theme-btn-shadow)] active:translate-y-2 border-2 border-transparent hover:border-theme-border">
            Сделать расчет заказа
          </Link>
        </motion.div>
      </div>
    </section>
  );
}