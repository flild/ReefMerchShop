'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'motion/react';
import { ArrowRight, Calculator, Sparkles } from 'lucide-react';

// Компонент одного живого пузырька
interface BubbleProps {
  size?: number;
  delay?: number;
  className?: string;
  duration?: number;
}

const bubbleVariants: Variants = {
  animate: {
    y: [0, -30, 0],
    scale: [1, 1.1, 0.9, 1],
    rotate: [0, 5, -5, 0],
  },
};

function Bubble({ size = 12, delay = 0, className = "", duration = 4 }: BubbleProps) {
  // Вычисляем длительность детерминированно на основе пропсов.
  // Никаких Math.random(), функция остается чистой, а анимации визуально отличаются.
  const yDuration = duration + (size % 3);
  const scaleDuration = duration + 1 + (delay % 2);
  const rotateDuration = duration + 2 + ((size + delay) % 3);

  return (
    <motion.div
      variants={bubbleVariants}
      animate="animate"
      transition={{
        y: { duration: yDuration, repeat: Infinity, ease: "easeInOut", delay },
        scale: { duration: scaleDuration, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: rotateDuration, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`absolute rounded-full anime-border bg-theme-surface/40 backdrop-blur-sm overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Эффект блика */}
      <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-theme-bg rounded-full opacity-60" />
      {/* Эффект объема через тень */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_-2px_10px_0_var(--theme-shadow-base)]" />
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[650px] flex items-center bg-theme-bg manga-dots overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-theme-surface rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-theme-accent/30 rounded-full blur-2xl" />
        
        {/* Живые пузырьки с эффектами */}
        <Bubble size={16} delay={0.5} className="top-1/4 left-1/4" />
        <Bubble size={10} delay={1.2} className="top-1/3 left-[20%]" />
        <Bubble size={24} delay={0} className="bottom-1/4 left-1/3" />
        <Bubble size={8} delay={1.8} className="bottom-1/3 left-[35%]" />
        <Bubble size={14} delay={0.8} className="top-1/2 left-[15%]" />
        <Bubble size={20} delay={2.5} className="top-2/3 right-[10%]" />
        <Bubble size={12} delay={1.5} className="bottom-[10%] right-[25%]" />
        
        {/* Анимированный фон (уже без хардкода) */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10 bg-theme-accent scale-150 bubble-shape"
        />
      </div>

      <div className="container mx-auto px-4 z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          className="space-y-8 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full anime-border shadow-sm text-theme-text font-bold text-sm tracking-wide">
            <Sparkles size={16} className="text-theme-accent" />
            Типография для мерчеделов
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-black text-theme-text leading-[1.1] drop-shadow-sm">
            <span className="text-theme-accent drop-shadow-md">РИФ</span> — твоя гавань мерча
          </h1>
          
          <p className="text-xl md:text-2xl text-theme-muted font-medium max-w-lg leading-relaxed">
            Акрил, стенды, брелоки и нестандартные формы — мы воплощаем самые яркие идеи в жизнь! 
          </p>
          
          <div className="flex flex-wrap gap-5 pt-4">
            <Link href="/portfolio" className="anime-button px-8 py-4 flex items-center gap-3 text-lg group">
              Посмотреть работы
              <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/calculator" className="px-8 py-4 flex items-center gap-3 text-lg group bg-theme-surface anime-border font-bold text-theme-text hover:bg-theme-bg shadow-[0_4px_0_0_var(--theme-border)] active:translate-y-1 active:shadow-none transition-all">
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
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-theme-accent bubble-shape shadow-[0_12px_0_0_var(--theme-shadow-base)] opacity-20 scale-105" 
            />
            
            <div className="absolute inset-0 bg-theme-surface bubble-shape anime-border anime-shadow z-10 overflow-hidden">
              <Image
                src="/og-image.jpg"
                alt="Акриловые брелоки и стенды на заказ от РИФ"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}