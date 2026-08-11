'use client';

import Link from 'next/link';
import { User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-glass relative">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform relative z-20">
          <div className="w-12 h-12 rounded-full bg-theme-accent flex items-center justify-center text-theme-surface font-black text-2xl leading-none shadow-[0_3px_0_0_var(--theme-btn-shadow)] pb-1 border-2 border-theme-surface">R</div>
          <span className="font-display font-black text-3xl tracking-tight text-theme-accent drop-shadow-sm">Reef</span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 font-bold text-lg text-theme-text/80">
          <Link href="/materials" className="hover:text-theme-accent hover:-translate-y-1 transition-all">Материалы</Link>
          <Link href="/calculator" className="hover:text-theme-accent hover:-translate-y-1 transition-all">Калькулятор</Link>
          <Link href="/portfolio" className="hover:text-theme-accent hover:-translate-y-1 transition-all">Портфолио</Link>
          <Link href="/collects" className="hover:text-theme-accent hover:-translate-y-1 transition-all">Коллекты</Link>
          <Link href="/templates" className="hover:text-theme-accent hover:-translate-y-1 transition-all">Шаблоны</Link>
          <Link href="/tools" className="hover:text-theme-accent hover:-translate-y-1 transition-all">Инструменты</Link>
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4 text-theme-accent relative z-20">
          <ThemeToggle />
          <Link href="/profile" className="p-3 hover:bg-theme-bg rounded-full transition-colors active:scale-95 hidden sm:flex">
            <User size={24} strokeWidth={2.5} />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 hover:bg-theme-bg rounded-full transition-colors active:scale-95"
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-theme-surface shadow-xl transition-all duration-300 origin-top overflow-hidden border-b border-theme-border ${isMobileMenuOpen ? 'max-h-96 border-b' : 'max-h-0 border-transparent'}`}>
        <nav className="flex flex-col px-6 py-4 font-bold text-lg text-theme-text">
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/materials" className="py-4 border-b border-theme-border hover:text-theme-accent flex items-center justify-between">Материалы</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/calculator" className="py-4 border-b border-theme-border hover:text-theme-accent flex items-center justify-between">Калькулятор</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/portfolio" className="py-4 border-b border-theme-border hover:text-theme-accent flex items-center justify-between">Портфолио</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/collects" className="py-4 border-b border-theme-border hover:text-theme-accent flex items-center justify-between">Коллекты</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/templates" className="py-4 border-b border-theme-border hover:text-theme-accent flex items-center justify-between">Шаблоны</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/tools" className="py-4 border-b border-theme-border hover:text-theme-accent flex items-center justify-between">Инструменты</Link>
          <Link onClick={() => setIsMobileMenuOpen(false)} href="/profile" className="py-4 hover:text-theme-accent flex items-center justify-between sm:hidden">Личный кабинет</Link>
        </nav>
      </div>
    </header>
  );
}