'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckSquare, AlertCircle, Copy, CheckCircle2, ChevronRight, Wand2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChecklistGenerator() {
  const [productType, setProductType] = useState('standee');
  const [hasWhite, setHasWhite] = useState(true);
  const [hasHolo, setHasHolo] = useState(false);
  const [doubleSided, setDoubleSided] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateChecklist = () => {
    let list = [];
    list.push('Цветовой профиль: **CMYK** (Fogra 39 / US Web Coated)');
    list.push('Разрешение: минимум **300 dpi**');
    list.push('Формат файла: **PSD** или **TIFF** (со слоями)');
    list.push('Слои не слиты (каждый элемент на отдельном слое)');
    list.push('Линия реза (Cut) выполнена векторным контуром (1px) в отдельном слое, либо заливкой с запасом (Bleed) 2мм');

    if (productType === 'standee') {
      list.push('Отверстия для базы на линии реза учтены (ширина 14мм, глубина 3-4мм)');
      list.push('База находится в том же файле на отдельном слое, либо в отдельном файле');
      list.push('Отверстие в базе (щель) соответствует толщине акрила (обычно 3мм, лучше делать 3.1мм)');
    } else if (productType === 'keychain') {
      list.push('Отверстие под фурнитуру учтено на линии реза (ушко не менее 2.5мм от края, отверстие ~2мм)');
    } else if (productType === 'pin') {
      list.push('Булавка помещается на макет (минимальный размер значка 30х30мм для стандартной булавки 25мм)');
    }

    if (hasWhite) {
      list.push('Слой белой подложки (White) присутствует и залит 100% черным цветом или плашечным цветом');
      list.push('Белая подложка на 0.1-0.2мм меньше цветного слоя (чтобы не торчал белый край)');
    }

    if (hasHolo) {
      list.push('Голография не перекрывает важные элементы лица (если не задуманно иначе)');
    }

    if (doubleSided) {
      list.push('Оборотная сторона (Back) присутствует в макете');
      list.push('Оборотная сторона отзеркалена относительно контура реза (если он не симметричный)');
      if (hasWhite) {
        list.push('Белая подложка общая для двух сторон (непрозрачная)');
      }
    }
    return list;
  };

  const checklist = generateChecklist();

  const handleCopy = () => {
    const text = checklist.map((item, i) => `${i + 1}. ${item.replace(/\*\*/g, '')}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-16 bg-theme-bg manga-dots">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          
          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <Link href="/tools" className="hover:text-theme-highlight transition-colors">Инструменты</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">Чек-лист</span>
          </nav>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full text-theme-highlight font-bold text-sm tracking-wide mb-6 anime-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
              <CheckSquare size={16} />
              Инструменты
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6">Генератор чек-листа</h1>
            <p className="text-xl text-theme-muted font-medium leading-relaxed max-w-3xl">
              Соберите индивидуальный список проверок для вашего макета перед отправкой в тираж.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            <div className="md:col-span-5 space-y-8">
              
              <div className="bg-theme-surface p-8 rounded-[40px] anime-border anime-shadow">
                <h3 className="text-2xl font-black text-theme-text mb-8 flex items-center gap-3">
                  <div className="p-2 bg-theme-bg rounded-xl border-2 border-theme-border text-theme-highlight">
                    <Wand2 size={24} strokeWidth={2.5} />
                  </div>
                  Параметры изделия
                </h3>

                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-black text-theme-muted mb-4 uppercase tracking-widest">Тип изделия</label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: 'standee', label: 'Акриловый стенд (фигурка)' },
                        { id: 'keychain', label: 'Брелок' },
                        { id: 'pin', label: 'Значок (пин)' },
                        { id: 'custom', label: 'Произвольная форма' }
                      ].map(type => (
                        <label key={type.id} className={`flex items-center p-4 rounded-2xl cursor-pointer border-2 transition-all ${productType === type.id ? 'border-theme-highlight bg-theme-highlight/10 shadow-sm -translate-y-0.5' : 'border-theme-border bg-theme-bg hover:border-theme-highlight/50'}`}>
                          <input type="radio" name="product" value={type.id} checked={productType === type.id} onChange={(e) => setProductType(e.target.value)} className="mr-4 accent-theme-accent w-5 h-5" />
                          <span className="font-bold text-theme-text text-lg">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-black text-theme-muted mb-4 uppercase tracking-widest">Особенности</label>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 rounded-2xl border-2 border-theme-border bg-theme-bg hover:border-theme-highlight/50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={hasWhite} onChange={(e) => setHasWhite(e.target.checked)} className="mr-4 accent-theme-accent w-5 h-5 rounded" />
                        <span className="font-bold text-theme-text">Белая подложка</span>
                      </label>
                      <label className="flex items-center p-4 rounded-2xl border-2 border-theme-border bg-theme-bg hover:border-theme-highlight/50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={doubleSided} onChange={(e) => setDoubleSided(e.target.checked)} className="mr-4 accent-theme-accent w-5 h-5 rounded" />
                        <span className="font-bold text-theme-text">Двусторонняя печать</span>
                      </label>
                      <label className="flex items-center p-4 rounded-2xl border-2 border-theme-border bg-theme-bg hover:border-theme-highlight/50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={hasHolo} onChange={(e) => setHasHolo(e.target.checked)} className="mr-4 accent-theme-accent w-5 h-5 rounded" />
                        <span className="font-bold text-theme-text">Голографическая пленка</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-theme-highlight/10 p-8 rounded-[32px] anime-border border-theme-highlight/30 flex flex-col sm:flex-row items-start gap-5">
                <div className="p-3 bg-theme-surface rounded-2xl text-theme-highlight anime-border shadow-[2px_2px_0_0_var(--theme-border)]">
                  <AlertCircle size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="font-black text-theme-text text-lg mb-2">Зачем это нужно?</h4>
                  <p className="text-theme-muted font-medium leading-relaxed">Ошибки в макетах — частая причина брака. Пройдитесь по чек-листу перед сохранением финального файла, чтобы не переплачивать за переделку тиража.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="bg-theme-surface p-8 md:p-10 rounded-[40px] anime-border anime-shadow sticky top-24">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                  <h2 className="text-3xl font-display font-black text-theme-text">Ваш чек-лист</h2>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-theme-bg hover:bg-theme-highlight/10 text-theme-text border-2 border-theme-border hover:border-theme-highlight/50 font-black rounded-2xl transition-all active:scale-95 shadow-sm"
                  >
                    {copied ? <><CheckCircle2 size={18} className="text-theme-green-text"/> Скопировано</> : <><Copy size={18} /> Скопировать</>}
                  </button>
                </div>

                <div className="space-y-4">
                  {checklist.map((item, index) => (
                    <motion.div 
                      key={index + item} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-5 p-5 rounded-3xl border-2 border-theme-border bg-theme-bg hover:border-theme-highlight/30 hover:bg-theme-highlight/5 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-xl border-2 border-theme-muted/50 bg-theme-surface flex-shrink-0 mt-0.5 group-hover:border-theme-highlight transition-colors shadow-inner" />
                      <div 
                        className="text-theme-text font-medium leading-relaxed text-lg"
                        dangerouslySetInnerHTML={{ 
                          __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-theme-highlight font-black">$1</strong>') 
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}