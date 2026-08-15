'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Image as ImageIcon, Upload, Sliders, MonitorPlay, ChevronRight, Trash2 } from 'lucide-react';

export default function MockupGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [thickness, setThickness] = useState(3);
  const [acrylicType, setAcrylicType] = useState('clear');
  const [shadow, setShadow] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const clearImage = () => setImage(null);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-16 bg-theme-bg manga-dots">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <Link href="/tools" className="hover:text-theme-highlight transition-colors">Инструменты</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">3D Превью</span>
          </nav>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full text-theme-highlight font-bold text-sm tracking-wide mb-6 anime-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
              <MonitorPlay size={16} />
              Инструменты
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6">3D превью акрила</h1>
            <p className="text-xl text-theme-muted max-w-2xl font-medium leading-relaxed">
              Загрузите ваш макет без фона (PNG), чтобы увидеть, как он будет смотреться в готовом изделии.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Настройки */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-theme-surface p-8 rounded-[40px] anime-border anime-shadow">
                <h3 className="text-2xl font-black text-theme-text mb-8 flex items-center gap-3">
                  <div className="p-2 bg-theme-bg rounded-xl border-2 border-theme-border text-theme-highlight">
                    <Sliders size={24} strokeWidth={2.5} />
                  </div>
                  Настройки
                </h3>

                {!image ? (
                  <div 
                    className="border-4 border-dashed border-theme-border rounded-[32px] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-theme-highlight hover:bg-theme-highlight/10 transition-all mb-8 group bg-theme-bg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-theme-surface anime-border rounded-full flex items-center justify-center text-theme-highlight mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-sm">
                      <Upload size={24} strokeWidth={2.5} />
                    </div>
                    <div className="font-black text-theme-text text-lg mb-1">Загрузить макет</div>
                    <div className="font-bold text-sm text-theme-muted px-4 py-1.5 bg-theme-surface border-2 border-theme-border rounded-xl mt-3">PNG без фона</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-theme-bg border-2 border-theme-border rounded-2xl mb-8 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-theme-surface border-2 border-theme-border rounded-xl text-theme-muted flex items-center justify-center overflow-hidden p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-sm font-black text-theme-text">Макет загружен</div>
                    </div>
                    <button onClick={clearImage} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 hover:scale-110 rounded-xl transition-all border-2 border-rose-500/20" title="Удалить">
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png" 
                  onChange={handleImageUpload} 
                />

                <div className={`space-y-8 transition-opacity duration-300 ${!image ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  <div>
                    <label className="block text-sm font-black text-theme-muted mb-4 uppercase tracking-widest">Тип акрила</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'clear', label: 'Прозрачный' },
                        { id: 'holo', label: 'Голография' },
                        { id: 'glitter', label: 'Блестки' },
                        { id: 'epoxy', label: 'Эпоксидка' }
                      ].map(type => (
                        <button 
                          key={type.id}
                          onClick={() => setAcrylicType(type.id)}
                          className={`py-3 px-4 rounded-2xl border-2 text-sm font-black transition-all ${
                            acrylicType === type.id 
                              ? 'border-theme-highlight bg-theme-highlight/10 text-theme-text shadow-[0_4px_0_0_var(--theme-shadow-base)] -translate-y-1' 
                              : 'border-theme-border bg-theme-bg text-theme-muted hover:border-theme-highlight/50 hover:bg-theme-surface hover:-translate-y-0.5'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-black text-theme-muted uppercase tracking-widest">Толщина</label>
                      <span className="font-black text-theme-text bg-theme-bg border-2 border-theme-border px-3 py-1 rounded-xl text-sm">{thickness} мм</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" max="5" step="1" 
                      value={thickness} 
                      onChange={(e) => setThickness(parseInt(e.target.value))}
                      className="w-full accent-theme-accent h-3 bg-theme-bg rounded-full appearance-none outline-none anime-border shadow-sm cursor-pointer mt-2"
                    />
                  </div>

                  <div>
                    <label className="flex items-center p-4 rounded-2xl border-2 border-theme-border bg-theme-bg hover:border-theme-highlight/50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={shadow} 
                        onChange={(e) => setShadow(e.target.checked)} 
                        className="mr-4 accent-theme-accent w-5 h-5 rounded" 
                      />
                      <span className="font-bold text-theme-text">Отбрасывать тень</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Вьювер */}
            <div className="lg:col-span-8">
              <div className="bg-theme-surface h-[600px] rounded-[40px] anime-border anime-shadow relative overflow-hidden flex items-center justify-center p-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">

                {/* Сетка на фоне */}
                <div className="absolute inset-0 border-2 border-theme-border opacity-20 bg-[linear-gradient(to_right,var(--theme-border)_2px,transparent_2px),linear-gradient(to_bottom,var(--theme-border)_2px,transparent_2px)] bg-[size:32px_32px]"></div>

                {!image ? (
                  <div className="text-center relative z-10 flex flex-col items-center bg-theme-surface/80 p-12 rounded-[40px] anime-border backdrop-blur-sm border-2">
                    <div className="w-24 h-24 bg-theme-bg rounded-full flex items-center justify-center text-theme-muted mb-6 border-2 border-theme-border shadow-inner">
                      <ImageIcon size={48} strokeWidth={2} />
                    </div>
                    <div className="text-3xl font-display font-black text-theme-muted">Загрузите макет для превью</div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center perspective-[1200px]">
                    <div 
                      className="relative transition-all duration-500 ease-out preserve-3d group cursor-grab active:cursor-grabbing hover:scale-105"
                      style={{ 
                        transform: 'rotateX(15deg) rotateY(-20deg)',
                        filter: shadow ? 'drop-shadow(-25px 25px 30px rgba(0,0,0,0.25))' : 'none'
                      }}
                    >
                      {/* Фронтальный слой принта */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="Print" className="relative z-10 max-h-[400px] object-contain drop-shadow-md pointer-events-none select-none" />

                      {/* Задняя белая подложка */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="White base" className="absolute top-[1px] left-[1px] z-0 max-h-[400px] object-contain brightness-0 invert opacity-100 translate-z-[-2px]" />

                      {/* Слои толщины акрила */}
                      {Array.from({ length: thickness * 2 }).map((_, i) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          key={i}
                          src={image} 
                          alt="Acrylic depth" 
                          className="absolute z-20 max-h-[400px] object-contain mix-blend-screen opacity-50"
                          style={{
                            top: `-${(i + 1) * 0.5}px`,
                            left: `${(i + 1) * 0.5}px`,
                            filter: 'brightness(100) blur(2px)',
                            transform: `translateZ(${(i + 1) * 0.5}px)`
                          }}
                        />
                      ))}

                      {/* Эффекты материалов поверх фронтального слоя */}
                      <div className="absolute inset-0 z-30 pointer-events-none" style={{
                         maskImage: `url(${image})`,
                         WebkitMaskImage: `url(${image})`,
                         maskSize: 'contain',
                         WebkitMaskSize: 'contain',
                         maskRepeat: 'no-repeat',
                         WebkitMaskRepeat: 'no-repeat',
                         maskPosition: 'center',
                         WebkitMaskPosition: 'center'
                      }}>
                        {/* Фаска / Блик по краю */}
                        <div className="absolute inset-0 border-4 border-white/50 rounded-[20%] mix-blend-overlay"></div>

                        {/* Динамический блик */}
                        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-white/50 to-transparent -translate-x-1/3 -translate-y-1/3 rotate-45 transform-gpu opacity-0 group-hover:opacity-100 group-hover:translate-x-1/3 transition-all duration-[1.5s]"></div>

                        {/* Голография */}
                        {acrylicType === 'holo' && (
                          <div className="absolute inset-0 mix-blend-color-dodge opacity-70 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-gradient-to-tr from-pink-400 via-cyan-300 to-purple-400 animate-pulse"></div>
                        )}
                        {/* Блестки */}
                        {acrylicType === 'glitter' && (
                          <div className="absolute inset-0 mix-blend-overlay opacity-60 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-amber-300"></div>
                        )}
                        {/* Эпоксидка */}
                        {acrylicType === 'epoxy' && (
                          <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(255,255,255,0.9)] backdrop-blur-md mix-blend-overlay opacity-80"></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}