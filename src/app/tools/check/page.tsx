'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileSearch, UploadCloud, CheckCircle2, XCircle, AlertTriangle, RefreshCw, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckToolPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'checking' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      simulateCheck();
    }
  };

  const simulateCheck = () => {
    setStatus('uploading');
    setProgress(0);

    const uploadInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 30) {
          clearInterval(uploadInterval);
          setStatus('checking');

          const checkInterval = setInterval(() => {
            setProgress(cp => {
              if (cp >= 100) {
                clearInterval(checkInterval);
                setStatus(Math.random() > 0.3 ? 'error' : 'success');
                return 100;
              }
              return cp + Math.random() * 15;
            });
          }, 300);

          return 30;
        }
        return p + 5;
      });
    }, 100);
  };

  const reset = () => {
    setFile(null);
    setStatus('idle');
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-16 bg-theme-bg manga-dots">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          
          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <Link href="/tools" className="hover:text-theme-highlight transition-colors">Инструменты</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">Валидатор</span>
          </nav>

          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full text-theme-highlight font-bold text-sm tracking-wide mb-6 anime-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
              <FileSearch size={16} />
              Автоматическая проверка
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6">Валидатор макетов</h1>
            <p className="text-xl text-theme-muted max-w-2xl mx-auto font-medium leading-relaxed">
              Загрузите PSD, TIFF или PDF. Наша система проверит слои, разрешение и цветовой профиль перед отправкой.
            </p>
          </div>

          <div className="bg-theme-surface rounded-[40px] p-8 md:p-12 anime-border anime-shadow">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-4 border-dashed border-theme-border rounded-[32px] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-theme-highlight hover:bg-theme-highlight/10 transition-all group bg-theme-bg"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) {
                      setFile(e.dataTransfer.files[0]);
                      simulateCheck();
                    }
                  }}
                >
                  <div className="w-24 h-24 bg-theme-surface anime-border rounded-full flex items-center justify-center text-theme-highlight mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                    <UploadCloud size={40} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-theme-text mb-2">Перетащите файл сюда</h3>
                  <p className="text-theme-muted mb-8 font-medium">или нажмите для выбора файла</p>

                  <div className="flex gap-4 text-sm font-black text-theme-muted">
                    <span className="px-4 py-1.5 bg-theme-surface border-2 border-theme-border rounded-xl">.PSD</span>
                    <span className="px-4 py-1.5 bg-theme-surface border-2 border-theme-border rounded-xl">.TIFF</span>
                    <span className="px-4 py-1.5 bg-theme-surface border-2 border-theme-border rounded-xl">.PDF</span>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept=".psd,.tiff,.pdf,image/tiff" />
                </motion.div>
              )}

              {(status === 'uploading' || status === 'checking') && (
                <motion.div 
                  key="checking"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 flex flex-col items-center text-center"
                >
                  <div className="w-24 h-24 relative mb-8">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="var(--theme-border)" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="var(--theme-highlight)" strokeWidth="8" 
                        strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100}
                        className="transition-all duration-300 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw size={32} className="text-theme-highlight animate-spin" strokeWidth={3} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-theme-text mb-2">
                    {status === 'uploading' ? 'Загрузка файла...' : 'Анализ слоев...'}
                  </h3>
                  <p className="text-theme-muted font-medium">{file?.name}</p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10"
                >
                  <div className="flex flex-col items-center text-center border-b-2 border-theme-border pb-10 mb-10">
                    <div className="w-24 h-24 bg-theme-green-bg anime-border rounded-full flex items-center justify-center text-theme-green-text mb-6 shadow-sm rotate-[-5deg]">
                      <CheckCircle2 size={48} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-black text-theme-text mb-2">Отлично! Макет готов к печати</h3>
                    <p className="text-theme-muted font-medium bg-theme-bg px-4 py-2 rounded-xl mt-2 border-2 border-theme-border">{file?.name}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {[
                      'CMYK профиль',
                      'Разрешение 300+ dpi',
                      'Слои "Cut" и "White" найдены',
                      'Размер в пределах нормы'
                    ].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 p-5 bg-theme-bg border-2 border-theme-border rounded-2xl">
                        <CheckCircle2 size={24} className="text-theme-green-text shrink-0" strokeWidth={3} />
                        <span className="font-bold text-theme-text">{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button onClick={reset} className="anime-button-alt px-8 py-4 bg-theme-bg text-theme-text border-2 border-theme-border shadow-[0_4px_0_0_var(--theme-border)] hover:bg-theme-surface hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all rounded-[24px] font-bold text-lg">
                      Проверить другой файл
                    </button>
                  </div>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10"
                >
                  <div className="flex flex-col items-center text-center border-b-2 border-theme-border pb-10 mb-10">
                    <div className="w-24 h-24 bg-rose-100 anime-border rounded-full flex items-center justify-center text-rose-500 mb-6 shadow-sm rotate-[5deg]">
                      <AlertTriangle size={48} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-3xl font-black text-theme-text mb-2">Найдены ошибки</h3>
                    <p className="text-theme-muted font-medium bg-theme-bg px-4 py-2 rounded-xl mt-2 border-2 border-theme-border">{file?.name}</p>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-start gap-4 p-6 bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl">
                      <XCircle size={28} className="text-rose-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <div>
                        <div className="font-black text-theme-text text-lg mb-1">Цветовой профиль RGB</div>
                        <div className="text-theme-muted font-medium text-sm leading-relaxed">Макет должен быть переведен в CMYK, иначе цвета при печати будут сильно отличаться.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-rose-500/10 border-2 border-rose-500/30 rounded-2xl">
                      <XCircle size={28} className="text-rose-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <div>
                        <div className="font-black text-theme-text text-lg mb-1">Слой &quot;Cut&quot; не найден</div>
                        <div className="text-theme-muted font-medium text-sm leading-relaxed">Необходимо добавить векторный слой с линией реза или залить фон навылет (Bleed).</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-6 bg-theme-yellow-bg border-2 border-theme-yellow-text/30 rounded-2xl">
                      <AlertTriangle size={28} className="text-theme-yellow-text flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <div>
                        <div className="font-black text-theme-yellow-text text-lg mb-1">Низкое разрешение (200 dpi)</div>
                        <div className="text-theme-yellow-text/80 font-medium text-sm leading-relaxed">Рекомендуемое разрешение для печати — 300 dpi. Возможно замыливание при печати.</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={reset} className="anime-button-alt px-8 py-4 bg-theme-bg text-theme-text border-2 border-theme-border shadow-[0_4px_0_0_var(--theme-border)] hover:bg-theme-surface hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all rounded-[24px] font-bold text-lg">
                      Исправить и загрузить снова
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}