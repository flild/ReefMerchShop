'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-glass dark:bg-slate-900/80 text-reef-dark dark:text-slate-100 relative border-b-2 border-reef-blue/10 dark:border-reef-cyan/20 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform relative z-20">
          <div className="w-12 h-12 rounded-full bg-reef-blue dark:bg-reef-cyan flex items-center justify-center text-white dark:text-slate-900 font-black text-2xl leading-none shadow-[0_3px_0_0_#093f8e] dark:shadow-[0_3px_0_0_#2a8bf2] pb-1 border-2 border-white dark:border-slate-900">R</div>
          <span className="font-display font-black text-3xl tracking-tight text-reef-blue dark:text-reef-cyan drop-shadow-sm">Reef</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 font-bold text-lg text-reef-blue/80 dark:text-slate-300">
          <Link href="/materials" className="hover:text-reef-blue dark:hover:text-reef-cyan hover:-translate-y-1 transition-all">Материалы</Link>
          <Link href="/calculator" className="hover:text-reef-blue dark:hover:text-reef-cyan hover:-translate-y-1 transition-all">Калькулятор</Link>
          <Link href="/portfolio" className="hover:text-reef-blue dark:hover:text-reef-cyan hover:-translate-y-1 transition-all">Портфолио</Link>
          <Link href="/collects" className="hover:text-reef-blue dark:hover:text-reef-cyan hover:-translate-y-1 transition-all">Коллекты</Link>
          <Link href="/templates" className="hover:text-reef-blue dark:hover:text-reef-cyan hover:-translate-y-1 transition-all">Шаблоны</Link>
          <Link href="/tools" className="hover:text-reef-blue dark:hover:text-reef-cyan hover:-translate-y-1 transition-all">Инструменты</Link>
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4 text-reef-blue dark:text-reef-cyan relative z-20">
          <ThemeToggle />
          <Link href="/profile" className="p-3 hover:bg-reef-light dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95 hidden sm:flex">
            <User size={24} strokeWidth={2.5} />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 hover:bg-reef-light rounded-full transition-colors active:scale-95"
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 origin-top overflow-hidden border-b border-slate-100 ${isMobileMenuOpen ? 'max-h-96 border-b' : 'max-h-0 border-transparent'}`}>
        <nav className="flex flex-col px-6 py-4 font-bold text-lg text-slate-700">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/materials" className="py-4 border-b border-slate-100 hover:text-reef-blue flex items-center justify-between">Материалы</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/calculator" className="py-4 border-b border-slate-100 hover:text-reef-blue flex items-center justify-between">Калькулятор</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/portfolio" className="py-4 border-b border-slate-100 hover:text-reef-blue flex items-center justify-between">Портфолио</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/collects" className="py-4 border-b border-slate-100 hover:text-reef-blue flex items-center justify-between">Коллекты</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/templates" className="py-4 border-b border-slate-100 hover:text-reef-blue flex items-center justify-between">Шаблоны</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/tools" className="py-4 border-b border-slate-100 hover:text-reef-blue flex items-center justify-between">Инструменты</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="py-4 hover:text-reef-blue flex items-center justify-between sm:hidden">Личный кабинет</Link>
        </nav>
      </div>
    </header>
  );
}
