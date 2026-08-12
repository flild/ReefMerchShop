import Link from 'next/link';
import { Send, Users, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-theme-surface text-theme-text pt-16 pb-8 mt-24 rounded-t-[3rem] border-t-[8px] border-theme-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full manga-dots opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 rounded-full bg-theme-accent text-theme-surface flex items-center justify-center font-black text-2xl leading-none shadow-[0_3px_0_0_var(--theme-btn-shadow)] pb-1 border-2 border-theme-surface">
               R
             </div>
             <span className="font-display font-black text-3xl tracking-tight text-theme-accent drop-shadow-sm">
               Reef
             </span>
          </div>
          <p className="text-theme-muted font-medium leading-relaxed max-w-xs">
            Специализированная типография для авторов мерча и создателей коллекционных изделий.
          </p>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-theme-text">Навигация</h4>
          <ul className="space-y-3 font-bold text-theme-muted">
            <li><Link href="/portfolio" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Портфолио</Link></li>
            <li><Link href="/materials" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Материалы</Link></li>
            <li><Link href="/calculator" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Калькулятор</Link></li>
            <li><Link href="/collects" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Коллекты</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-theme-text">Инструменты</h4>
          <ul className="space-y-3 font-bold text-theme-muted">
            <li><Link href="/tools/checklist" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Чек-лист макета</Link></li>
            <li><Link href="/tools/mockup" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Генератор мокапов</Link></li>
            <li><Link href="/templates" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Скачать шаблоны</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-theme-text">Связь с нами</h4>
          <ul className="space-y-4 font-bold text-theme-muted">
            <li>
              <a href="https://vk.com/reef_print" target="_blank" rel="noopener noreferrer" className="hover:text-theme-accent hover:translate-x-1 transition-transform flex items-center gap-2">
                <Users size={20} strokeWidth={2.5} />
                VKontakte
              </a>
            </li>
            <li>
              <a href="https://t.me/reef_print" target="_blank" rel="noopener noreferrer" className="hover:text-theme-accent hover:translate-x-1 transition-transform flex items-center gap-2">
                <Send size={20} strokeWidth={2.5} />
                Telegram
              </a>
            </li>
            <li className="pt-2 flex items-center gap-2 text-theme-text">
              <MapPin size={20} className="text-theme-accent" strokeWidth={2.5} />
              г. Санкт-Петербург
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t-2 border-theme-border text-center font-bold text-theme-muted text-sm relative z-10">
        &copy; {new Date().getFullYear()} Reef. Создано для художников.
      </div>
    </footer>
  );
}