'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Calculator, Send, Users } from 'lucide-react';

export function CtaSection() {
  return (
    <section className="py-24 bg-theme-accent relative overflow-hidden border-t-4 border-theme-border">
      {/* Манга-фон, который подстраивается под акцентный цвет */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--theme-text-main) 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-theme-surface rounded-[48px] p-10 md:p-16 anime-border anime-shadow-hover text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-black text-theme-text mb-6 drop-shadow-sm">
              Готовы печатать?
            </h2>
            <p className="text-xl text-theme-muted font-medium mb-10 max-w-2xl mx-auto">
              Рассчитайте стоимость заказа прямо сейчас или напишите нашим менеджерам. Мы поможем с макетами и ответим на любые технические вопросы.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row flex-wrap justify-center gap-4"
          >
            <Link 
              href="/calculator" 
              className="anime-button flex items-center justify-center gap-3 px-8 py-5 text-xl w-full sm:w-auto"
            >
              <Calculator size={24} strokeWidth={2.5} />
              Калькулятор заказа
            </Link>
            
            <Link 
              href="https://t.me/reef_print" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-5 text-xl font-bold bg-[#2AABEE] text-white rounded-[30px] border-2 border-theme-border shadow-[0_6px_0_0_#1c7baf] hover:shadow-[0_4px_0_0_#1c7baf] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all w-full sm:w-auto"
            >
              <Send size={24} strokeWidth={2.5} />
              Telegram
            </Link>
            
            <Link 
              href="https://vk.com/reef_print" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-8 py-5 text-xl font-bold bg-[#0077FF] text-white rounded-[30px] border-2 border-theme-border shadow-[0_6px_0_0_#0059bf] hover:shadow-[0_4px_0_0_#0059bf] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all w-full sm:w-auto"
            >
              <Users size={24} strokeWidth={2.5} />
              ВКонтакте
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}