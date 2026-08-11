import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-reef-blue dark:bg-slate-950 text-white pt-16 pb-8 mt-24 rounded-t-[3rem] border-t-[8px] border-[var(--theme-btn-shadow)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full manga-dots opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-6">
             <div className="w-12 h-12 rounded-full bg-white text-reef-blue flex items-center justify-center font-black text-2xl leading-none shadow-[0_3px_0_0_#093f8e] pb-1">R</div>
             <span className="font-display font-black text-3xl tracking-tight drop-shadow-md">Reef</span>
          </div>
          <p className="opacity-90 font-medium leading-relaxed max-w-xs">Мур-мур! Типография для художников, авторов мерча и создателей милых штучек.</p>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-white/90">Навигация</h4>
          <ul className="space-y-3 font-bold opacity-90">
            <li><Link href="/portfolio" className="hover:text-reef-cyan hover:pl-2 transition-all">Портфолио</Link></li>
            <li><Link href="/materials" className="hover:text-reef-cyan hover:pl-2 transition-all">Материалы</Link></li>
            <li><Link href="/calculator" className="hover:text-reef-cyan hover:pl-2 transition-all">Калькулятор</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-white/90">Инструменты</h4>
          <ul className="space-y-3 font-bold opacity-90">
            <li><Link href="/tools/checklist" className="hover:text-reef-cyan hover:pl-2 transition-all">Чек-лист макета</Link></li>
            <li><Link href="/tools/mockup" className="hover:text-reef-cyan hover:pl-2 transition-all">Примерить арт</Link></li>
            <li><Link href="/templates" className="hover:text-reef-cyan hover:pl-2 transition-all">Скачать шаблоны</Link></li>
            <li><Link href="/tools/check" className="hover:text-reef-cyan hover:pl-2 transition-all">Проверить файл</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-display font-black text-xl mb-6 text-white/90">Связь с нами</h4>
          <ul className="space-y-3 font-bold opacity-90">
            <li><a href="#" className="hover:text-reef-cyan hover:pl-2 transition-all flex items-center gap-2">VKontakte</a></li>
            <li><a href="#" className="hover:text-reef-cyan hover:pl-2 transition-all flex items-center gap-2">Telegram</a></li>
            <li className="pt-2 opacity-80">📍 Санкт-Петербург</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t-2 border-white/20 text-center font-bold opacity-80 text-sm relative z-10">
        &copy; {new Date().getFullYear()} Reef. Создано с любовью 💙
      </div>
    </footer>
  );
}