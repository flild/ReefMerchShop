'use client';

import { useState, useRef, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileSearch, UploadCloud, CheckCircle2, XCircle, AlertTriangle, RefreshCw, File } from 'lucide-react';
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
    
    // Upload phase
    const uploadInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 30) {
          clearInterval(uploadInterval);
          setStatus('checking');
          
          // Checking phase
          const checkInterval = setInterval(() => {
            setProgress(cp => {
              if (cp >= 100) {
                clearInterval(checkInterval);
                // Randomize result a bit, but mostly show errors for demonstration
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
      
      <main className="flex-1 py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-reef-light rounded-full text-reef-blue font-bold text-sm tracking-wide mb-4">
              <FileSearch size={16} />
              Автоматическая проверка
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6">Валидатор макетов</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Загрузите PSD, TIFF или PDF. Наша система проверит слои, разрешение и цветовой профиль перед отправкой.
            </p>
          </div>

          <div className="bg-white rounded-[40px] p-8 md:p-12 anime-border shadow-sm">
            
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div 
                  key="upload"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-4 border-dashed border-slate-200 rounded-[32px] p-16 flex flex-col items-center justify-center text-center cursor-pointer hover:border-reef-blue hover:bg-reef-light/20 transition-all group"
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
                  <div className="w-24 h-24 bg-reef-light rounded-full flex items-center justify-center text-reef-blue mb-6 group-hover:scale-110 transition-transform">
                    <UploadCloud size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Перетащите файл сюда</h3>
                  <p className="text-slate-500 mb-8 font-medium">или нажмите для выбора файла</p>
                  
                  <div className="flex gap-4 text-sm font-bold text-slate-400">
                    <span className="px-3 py-1 bg-slate-100 rounded-lg">.PSD</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-lg">.TIFF</span>
                    <span className="px-3 py-1 bg-slate-100 rounded-lg">.PDF</span>
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
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                      <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#00bcd4" strokeWidth="8" 
                        strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100}
                        className="transition-all duration-300 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw size={32} className="text-reef-blue animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">
                    {status === 'uploading' ? 'Загрузка файла...' : 'Анализ слоев...'}
                  </h3>
                  <p className="text-slate-500 font-medium">{file?.name}</p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10"
                >
                  <div className="flex flex-col items-center text-center border-b border-slate-100 pb-10 mb-10">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-2">Отлично! Макет готов к печати</h3>
                    <p className="text-slate-500 font-medium">{file?.name}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="font-bold text-slate-700">CMYK профиль</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="font-bold text-slate-700">Разрешение 300+ dpi</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="font-bold text-slate-700">Слои &quot;Cut&quot; и &quot;White&quot; найдены</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                      <CheckCircle2 size={24} className="text-green-500" />
                      <span className="font-bold text-slate-700">Размер в пределах нормы</span>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={reset} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
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
                  <div className="flex flex-col items-center text-center border-b border-slate-100 pb-10 mb-10">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
                      <AlertTriangle size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-2">Найдены ошибки</h3>
                    <p className="text-slate-500 font-medium">{file?.name}</p>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                      <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-700 mb-1">Цветовой профиль RGB</div>
                        <div className="text-red-600/80 text-sm">Макет должен быть переведен в CMYK, иначе цвета при печати будут отличаться.</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-100 rounded-2xl">
                      <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-red-700 mb-1">Слой &quot;Cut&quot; не найден</div>
                        <div className="text-red-600/80 text-sm">Необходимо добавить векторный слой с линией реза или залить фон навылет (Bleed).</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-orange-50 border border-orange-100 rounded-2xl">
                      <AlertTriangle size={24} className="text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-orange-700 mb-1">Низкое разрешение (200 dpi)</div>
                        <div className="text-orange-600/80 text-sm">Рекомендуемое разрешение для печати — 300 dpi. Возможно замыливание.</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={reset} className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                      Попробовать снова
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
