'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const NAV_LINKS = [
  { href: '/materials', label: 'Материалы' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/collects', label: 'Коллекты' },
  { href: '/templates', label: 'Шаблоны' },
  { href: '/tools', label: 'Инструменты' },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Блокируем скролл боди при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-glass">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform relative z-20">
          <div className="w-12 h-12 rounded-full bg-theme-accent flex items-center justify-center text-theme-surface font-black text-2xl leading-none shadow-[0_3px_0_0_var(--theme-btn-shadow)] pb-1 border-2 border-theme-surface">
            R
          </div>
          <span className="font-display font-black text-3xl tracking-tight text-theme-accent drop-shadow-sm">
            Reef
          </span>
        </Link>
        
        <nav className="hidden lg:flex items-center gap-8 font-bold text-lg text-theme-text/80">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={`transition-all hover:-translate-y-1 ${
                  isActive 
                    ? 'text-theme-accent border-b-2 border-theme-accent' 
                    : 'hover:text-theme-accent border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4 text-theme-accent relative z-20">
          <ThemeToggle />
          <Link href="/profile" className="p-3 hover:bg-theme-bg rounded-full transition-colors active:scale-95 hidden sm:flex">
            <User size={24} strokeWidth={2.5} />
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 hover:bg-theme-bg rounded-full transition-colors active:scale-95"
            aria-label="Меню"
          >
            {isMobileMenuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {/* Мобильное меню с использованием CSS Grid для плавной анимации высоты */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-theme-surface shadow-xl origin-top grid transition-[grid-template-rows,opacity] duration-300 ease-in-out border-b border-theme-border ${
          isMobileMenuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col px-6 py-4 font-bold text-lg text-theme-text">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link 
                  key={link.href}
                  onClick={() => setIsMobileMenuOpen(false)} 
                  href={link.href} 
                  className={`py-4 border-b border-theme-border flex items-center justify-between ${
                    isActive ? 'text-theme-accent' : 'hover:text-theme-accent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link 
              onClick={() => setIsMobileMenuOpen(false)} 
              href="/profile" 
              className="py-4 hover:text-theme-accent flex items-center justify-between sm:hidden"
            >
              Личный кабинет
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}