'use client';

import { useState } from 'react';
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
    
    // Base checks
    list.push('Цветовой профиль: **CMYK** (Fogra 39 / US Web Coated)');
    list.push('Разрешение: минимум **300 dpi**');
    list.push('Формат файла: **PSD** или **TIFF** (со слоями)');
    list.push('Слои не слиты (каждый элемент на отдельном слое)');
    list.push('Линия реза (Cut) выполнена векторным контуром (1px) в отдельном слое, либо заливкой с запасом (Bleed) 2мм');
    
    // Product specific
    if (productType === 'standee') {
      list.push('Отверстия для базы на линии реза учтены (ширина 14мм, глубина 3-4мм)');
      list.push('База находится в том же файле на отдельном слое, либо в отдельном файле');
      list.push('Отверстие в базе (щель) соответствует толщине акрила (обычно 3мм, лучше делать 3.1мм)');
    } else if (productType === 'keychain') {
      list.push('Отверстие под фурнитуру учтено на линии реза (ушко не менее 2.5мм от края, отверстие ~2мм)');
    } else if (productType === 'pin') {
      list.push('Булавка помещается на макет (минимальный размер значка 30х30мм для стандартной булавки 25мм)');
    }
    
    // Material specific
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
      
      <main className="flex-1 py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-reef-light rounded-full text-reef-blue font-bold text-sm tracking-wide mb-4">
              <CheckSquare size={16} />
              Инструменты
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6">Генератор чек-листа</h1>
            <p className="text-xl text-slate-600">
              Соберите индивидуальный список проверок для вашего макета перед отправкой в тираж.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl anime-border shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Wand2 size={20} className="text-reef-blue" />
                  Параметры изделия
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Тип изделия</label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { id: 'standee', label: 'Акриловый стенд (фигурка)' },
                        { id: 'keychain', label: 'Брелок' },
                        { id: 'pin', label: 'Значок (пин)' },
                        { id: 'custom', label: 'Произвольная форма' }
                      ].map(type => (
                        <label key={type.id} className={`flex items-center p-3 rounded-xl cursor-pointer border-2 transition-all ${productType === type.id ? 'border-reef-blue bg-reef-light/30' : 'border-slate-100 hover:border-reef-cyan/50'}`}>
                          <input type="radio" name="product" value={type.id} checked={productType === type.id} onChange={(e) => setProductType(e.target.value)} className="mr-3 accent-reef-blue w-4 h-4" />
                          <span className="font-medium text-slate-800">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Особенности</label>
                    <div className="space-y-2">
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" checked={hasWhite} onChange={(e) => setHasWhite(e.target.checked)} className="mr-3 accent-reef-blue w-4 h-4 rounded" />
                        <span className="font-medium text-slate-800">Белая подложка</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" checked={doubleSided} onChange={(e) => setDoubleSided(e.target.checked)} className="mr-3 accent-reef-blue w-4 h-4 rounded" />
                        <span className="font-medium text-slate-800">Двусторонняя печать</span>
                      </label>
                      <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                        <input type="checkbox" checked={hasHolo} onChange={(e) => setHasHolo(e.target.checked)} className="mr-3 accent-reef-blue w-4 h-4 rounded" />
                        <span className="font-medium text-slate-800">Голографическая пленка</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-reef-light/50 p-6 rounded-3xl anime-border border-reef-blue/20 flex items-start gap-4">
                <div className="p-2 bg-white rounded-full text-reef-blue shadow-sm">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-reef-dark mb-1">Зачем это нужно?</h4>
                  <p className="text-sm text-slate-600">Ошибки в макетах — частая причина брака. Пройдитесь по чек-листу перед сохранением финального файла, чтобы не переплачивать за переделку тиража.</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="bg-white p-8 rounded-3xl anime-border shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-slate-800">Ваш чек-лист</h2>
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-sm transition-colors"
                  >
                    {copied ? <><CheckCircle2 size={16} className="text-green-500"/> Скопировано</> : <><Copy size={16} /> Скопировать</>}
                  </button>
                </div>
                
                <div className="space-y-4">
                  {checklist.map((item, index) => (
                    <motion.div 
                      key={index + item} // force re-render animation on change
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="w-6 h-6 rounded border-2 border-slate-300 bg-white flex-shrink-0 mt-0.5 group-hover:border-reef-cyan transition-colors" />
                      <div 
                        className="text-slate-700 font-medium leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-reef-dark">$1</strong>') 
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
