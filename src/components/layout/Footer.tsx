import Link from 'next/link';
import { Send, MapPin } from 'lucide-react';

function VkIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93V15.07C2 20.67 3.33 22 8.93 22H15.07C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2ZM17.9 15.86H16.48C15.94 15.86 15.77 15.43 15.03 14.69C14.38 14.04 14.12 13.91 13.82 13.91C13.4 13.91 13.27 14.03 13.27 14.63V15.35C13.27 15.68 13.16 15.86 12.28 15.86C10.82 15.86 8.84 14.97 7.42 12.92C5.3 9.87 4.7 7.57 4.7 7.21C4.7 7.01 4.78 6.83 5.18 6.83H6.6C6.96 6.83 7.09 6.99 7.23 7.38C8.01 9.65 9.45 11.63 10.02 11.63C10.24 11.63 10.34 11.53 10.34 10.98V8.9C10.34 7.97 10.07 7.84 9.53 7.84C9.37 7.84 9.25 7.8 9.25 7.63C9.25 7.39 9.61 7.15 10.22 7.15H12.02C12.44 7.15 12.65 7.36 12.65 7.82V10.81C12.65 11.14 12.8 11.25 12.93 11.25C13.19 11.25 13.4 11.08 13.9 10.58C14.88 9.48 15.58 7.38 15.58 7.38C15.68 7.15 15.84 6.83 16.2 6.83H17.62C18.04 6.83 18.14 7.04 18.04 7.33C17.9 8.21 16.29 10.66 16.29 10.66C16.12 10.92 16.05 11.08 16.29 11.4C16.45 11.63 17.02 12.18 17.41 12.62C18.11 13.41 18.66 14.28 18.78 14.82C18.9 15.35 18.6 15.86 17.9 15.86Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-theme-surface text-theme-text pt-16 pb-8 mt-24 rounded-t-[3rem] border-t-[8px] border-theme-border relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full manga-dots opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 relative z-10">
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
            <li><Link href="/privacy" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Политика конфиденциальности</Link></li>
            <li><Link href="/terms" className="hover:text-theme-accent hover:translate-x-1 transition-transform inline-block">Условия Оферты</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-theme-text">Связь с нами</h4>
          <ul className="space-y-4 font-bold text-theme-muted">
            <li>
              <a href="https://vk.ru/merchreef" target="_blank" rel="noopener noreferrer" className="hover:text-theme-accent hover:translate-x-1 transition-transform flex items-center gap-2">
                <VkIcon size={20} />
                VK
              </a>
            </li>
            <li>
              <a href="https://t.me/merchreef" target="_blank" rel="noopener noreferrer" className="hover:text-theme-accent hover:translate-x-1 transition-transform flex items-center gap-2">
                <Send size={20} strokeWidth={2.5} />
                Telegram
              </a>
            </li>
            <li>
              <a href="mailto:merchreef@mail.ru" className="hover:text-theme-accent hover:translate-x-1 transition-transform flex items-center gap-2">
                <MapPin size={20} strokeWidth={2.5} className="opacity-0" />
                merchreef@mail.ru
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