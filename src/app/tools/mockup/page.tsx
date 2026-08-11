'use client';

import { useState, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Image as ImageIcon, Upload, Download, Sliders, MonitorPlay } from 'lucide-react';
import Image from 'next/image';

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
      
      <main className="flex-1 py-16 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-reef-light rounded-full text-reef-blue font-bold text-sm tracking-wide mb-4">
              <MonitorPlay size={16} />
              Инструменты
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6">3D превью акрила</h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Загрузите ваш макет без фона (PNG), чтобы увидеть, как он будет смотреться в готовом изделии.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl anime-border shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Sliders size={20} className="text-reef-blue" />
                  Настройки изделия
                </h3>
                
                {!image ? (
                  <div 
                    className="border-2 border-dashed border-reef-blue/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-reef-light/30 transition-colors mb-6 group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="w-16 h-16 bg-reef-light rounded-full flex items-center justify-center text-reef-blue mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <div className="font-bold text-slate-700 mb-1">Загрузить макет</div>
                    <div className="text-xs text-slate-500">PNG с прозрачным фоном</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-6 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-200 rounded text-slate-400 flex items-center justify-center overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="text-sm font-bold text-slate-700">Макет загружен</div>
                    </div>
                    <button onClick={clearImage} className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1 bg-red-50 rounded-lg">Удалить</button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png" 
                  onChange={handleImageUpload} 
                />

                <div className="space-y-6 opacity-100">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Тип акрила</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setAcrylicType('clear')}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${acrylicType === 'clear' ? 'border-reef-blue bg-reef-light/30 text-reef-dark' : 'border-slate-100 text-slate-600 hover:border-reef-cyan/50'}`}
                      >
                        Прозрачный
                      </button>
                      <button 
                        onClick={() => setAcrylicType('holo')}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${acrylicType === 'holo' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-100 text-slate-600 hover:border-purple-300'}`}
                      >
                        Голография
                      </button>
                      <button 
                        onClick={() => setAcrylicType('glitter')}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${acrylicType === 'glitter' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-100 text-slate-600 hover:border-amber-300'}`}
                      >
                        Блестки
                      </button>
                      <button 
                        onClick={() => setAcrylicType('epoxy')}
                        className={`py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${acrylicType === 'epoxy' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-600 hover:border-blue-300'}`}
                      >
                        Эпоксидка
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Толщина (мм)</label>
                      <span className="font-bold text-reef-dark bg-reef-light px-2 py-0.5 rounded text-xs">{thickness} мм</span>
                    </div>
                    <input 
                      type="range" 
                      min="2" max="5" step="1" 
                      value={thickness} 
                      onChange={(e) => setThickness(parseInt(e.target.value))}
                      className="w-full accent-reef-blue"
                    />
                  </div>

                  <div>
                    <label className="flex items-center p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={shadow} 
                        onChange={(e) => setShadow(e.target.checked)} 
                        className="mr-3 accent-reef-blue w-4 h-4 rounded" 
                      />
                      <span className="font-medium text-slate-800">Отбрасывать тень</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Stage */}
            <div className="lg:col-span-8">
              <div className="bg-white h-[600px] rounded-[40px] anime-border anime-shadow relative overflow-hidden flex items-center justify-center p-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                
                {/* Background grid */}
                <div className="absolute inset-0 border-[1px] border-slate-100/[0.1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                {!image ? (
                  <div className="text-center relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 bg-reef-light/50 rounded-full flex items-center justify-center text-reef-blue/50 mb-6 border border-reef-blue/20">
                      <ImageIcon size={40} />
                    </div>
                    <div className="text-2xl font-display font-bold text-slate-300">Загрузите макет для превью</div>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
                    <div 
                      className={`relative transition-all duration-500 ease-out preserve-3d group cursor-grab active:cursor-grabbing hover:scale-105`}
                      style={{ 
                        transform: 'rotateX(15deg) rotateY(-15deg)',
                        filter: shadow ? 'drop-shadow(-20px 20px 25px rgba(0,0,0,0.15))' : 'none'
                      }}
                    >
                      {/* Base print layer */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="Print" className="relative z-10 max-h-[400px] object-contain drop-shadow-sm pointer-events-none select-none" />
                      
                      {/* White base (simulated) */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={image} alt="White base" className="absolute top-[1px] left-[1px] z-0 max-h-[400px] object-contain brightness-0 invert opacity-95 translate-z-[-1px]" />
                      
                      {/* Acrylic body depth */}
                      {Array.from({ length: thickness * 2 }).map((_, i) => (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          key={i}
                          src={image} 
                          alt="Acrylic depth" 
                          className={`absolute z-20 max-h-[400px] object-contain mix-blend-screen opacity-40`}
                          style={{
                            top: `-${(i + 1) * 0.5}px`,
                            left: `${(i + 1) * 0.5}px`,
                            filter: 'brightness(100) blur(1px)',
                            transform: `translateZ(${(i + 1) * 0.5}px)`
                          }}
                        />
                      ))}

                      {/* Acrylic surface reflections & effects */}
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
                        {/* Edge highlight */}
                        <div className="absolute inset-0 border-2 border-white/40 rounded-[20%]"></div>
                        
                        {/* Glare */}
                        <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-1/3 -translate-y-1/3 rotate-45 transform-gpu opacity-0 group-hover:opacity-100 group-hover:translate-x-1/3 transition-all duration-700"></div>

                        {/* Effects by type */}
                        {acrylicType === 'holo' && (
                          <div className="absolute inset-0 mix-blend-overlay opacity-60 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-gradient-to-tr from-pink-300 via-cyan-300 to-purple-300 animate-pulse"></div>
                        )}
                        {acrylicType === 'glitter' && (
                          <div className="absolute inset-0 mix-blend-overlay opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-amber-200"></div>
                        )}
                        {acrylicType === 'epoxy' && (
                          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(255,255,255,0.8)] backdrop-blur-sm mix-blend-overlay opacity-70"></div>
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
