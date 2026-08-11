'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[650px] flex items-center bg-reef-light manga-dots overflow-hidden">
      {/* Декоративный фон */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-white rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-reef-cyan/30 rounded-full blur-2xl" />
        
        {/* Анимированные пузыри на фоне */}
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border-4 border-white/40" 
        />
        <motion.div 
          animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/3 w-12 h-12 rounded-full border-4 border-reef-blue/20" 
        />
      </div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="space-y-8 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full anime-border shadow-sm text-reef-blue font-bold text-sm tracking-wide">
            <Sparkles size={16} className="text-reef-cyan" />
            Типография для мерчеделов
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-slate-800 leading-[1.1] drop-shadow-sm">
            <span className="text-reef-blue drop-shadow-md">РИФ</span> — твоя гавань мерча
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 font-medium max-w-lg leading-relaxed">
            Акрил, стенды, брелоки и нестандартные формы — мы воплощаем самые яркие идеи в жизнь! 
          </p>
          
          <div className="flex flex-wrap gap-5 pt-4">
            <Link href="/portfolio" className="anime-button px-8 py-4 flex items-center gap-3 text-lg group">
              Посмотреть работы
              <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/calculator" className="anime-button-alt px-8 py-4 flex items-center gap-3 text-lg group">
              Рассчитать заказ
              <Calculator size={24} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          className="flex justify-center relative mt-12 lg:mt-0"
        >
          <div className="relative w-full max-w-[500px] aspect-square">
            {/* Тень-пузырь позади */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-reef-cyan bubble-shape shadow-[0_12px_0_0_#2a8bf2] opacity-20 scale-105" 
            />
            
            {/* Основная картинка с маской-пузырем */}
            <div className="absolute inset-0 bg-white bubble-shape anime-border anime-shadow z-10 overflow-hidden border-8">
              <Image
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=800"
                alt="Anime blue ocean illustration"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}