'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Home, Compass } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-24 bg-theme-bg manga-dots relative overflow-hidden">
        {/* Декоративные пятна на фоне */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-theme-highlight/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-theme-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 flex flex-col items-center z-10 relative">
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="relative mb-12 mt-8"
          >
            {/* Огромный баббл с 404 */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-[120px] md:text-[180px] leading-none font-display font-black text-theme-highlight drop-shadow-sm bg-theme-surface border-4 border-theme-border px-12 py-8 bubble-shape anime-shadow"
            >
              404
            </motion.div>
            
            {/* Плавающий стикер */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [12, 16, 12] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -right-8 bg-theme-yellow-bg text-theme-yellow-text border-2 border-theme-border shadow-[4px_4px_0_0_var(--theme-border)] px-6 py-3 rounded-full font-black text-xl z-10"
            >
              Упс!
            </motion.div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 text-center drop-shadow-sm">
            Мы сели на мель...
          </h2>
          
          <p className="text-xl text-theme-muted mb-10 text-center max-w-lg font-medium leading-relaxed">
            Похоже, эта страница уплыла в неизвестном направлении или её никогда не существовало. Давай вернемся в безопасную гавань!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/" className="anime-button px-8 py-4 flex items-center justify-center gap-3 text-lg">
              <Home size={24} strokeWidth={2.5} />
              На главную
            </Link>
            <Link 
              href="/portfolio" 
              className="px-8 py-4 flex items-center justify-center gap-3 text-lg font-bold text-theme-text bg-theme-surface border-2 border-theme-border rounded-[30px] shadow-[0_4px_0_0_var(--theme-border)] hover:bg-theme-bg hover:-translate-y-1 hover:shadow-[0_6px_0_0_var(--theme-border)] active:translate-y-1 active:shadow-none transition-all"
            >
              <Compass size={24} strokeWidth={2.5} />
              Смотреть работы
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}