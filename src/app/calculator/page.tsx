'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calculator, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';

export default function CalculatorPage() {
  const [productType, setProductType] = useState('keychain');
  const [material, setMaterial] = useState('acrylic_clear');
  const [size, setSize] = useState('50');
  const [quantity, setQuantity] = useState(50);
  
  // Fake calculation logic for UI prototyping
  const basePrice = productType === 'keychain' ? 40 : productType === 'stand' ? 120 : 60;
  const materialMultiplier = material === 'acrylic_clear' ? 1 : material === 'acrylic_pearl' ? 1.5 : 1.3;
  const sizeMultiplier = parseInt(size) / 50;
  
  const unitPrice = Math.round(basePrice * materialMultiplier * sizeMultiplier);
  const total = unitPrice * quantity;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 py-16 bg-reef-light manga-dots">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Form Section */}
            <div className="flex-1 bg-white rounded-[40px] p-10 anime-border anime-shadow relative">
              <div className="absolute top-0 right-10 -translate-y-1/2 bg-reef-blue text-white px-6 py-2 rounded-full font-bold shadow-[0_4px_0_0_#093f8e] flex items-center gap-2">
                <Sparkles size={16} /> Калькулятор
              </div>
                            <div className="flex items-center gap-4 mb-10 text-reef-blue">
                <div className="p-4 bg-reef-light rounded-3xl anime-border">
                  <Calculator size={36} strokeWidth={2.5} />
                </div>
                <h1 className="text-4xl font-display font-black text-slate-800">Калькулятор стоимости</h1>
              </div>
              
              <div className="mb-8 p-6 bg-blue-50/50 border-2 border-blue-100 rounded-[24px] text-blue-800 font-medium leading-relaxed">
                <span className="font-bold">Обратите внимание:</span> составные брелки и стенды считаются как два раздельных изделия. Условно, когда от одного брелка висит другой, это считается как 6см брелок + 6см брелок.
              </div>
              
              <div className="space-y-10">
                {/* Product Type */}
                <div>
                  <h3 className="font-display font-black text-xl text-slate-800 mb-4">Тип изделия</h3>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {[
                      { id: 'keychain', name: 'Брелочек' },
                      { id: 'stand', name: 'Стенд' }
                    ].map(type => (
                      <button
                        key={type.id}
                        onClick={() => setProductType(type.id)}
                        className={`p-5 rounded-[24px] border-2 text-center transition-all font-bold text-lg ${
                          productType === type.id 
                            ? 'border-reef-blue bg-reef-blue/10 text-reef-blue shadow-[0_4px_0_0_rgba(42,139,242,0.2)] -translate-y-1' 
                            : 'border-slate-200 hover:border-reef-cyan/50 text-slate-500 hover:bg-reef-light/50 hover:-translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <h3 className="font-display font-black text-xl text-slate-800 mb-4">Материал</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'acrylic_clear', name: 'Прозрачный акрил' },
                      { id: 'acrylic_pearl', name: 'Жемчужный акрил' },
                      { id: 'acrylic_color', name: 'Цветной акрил' },
                    ].map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => setMaterial(mat.id)}
                        className={`p-5 rounded-[24px] border-2 text-left transition-all font-bold text-lg ${
                          material === mat.id 
                            ? 'border-reef-blue bg-reef-blue/10 text-reef-blue shadow-[0_4px_0_0_rgba(42,139,242,0.2)] -translate-y-1' 
                            : 'border-slate-200 hover:border-reef-cyan/50 text-slate-500 hover:bg-reef-light/50 hover:-translate-y-1 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]'
                        }`}
                      >
                        {mat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size & Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-reef-light/50 p-8 rounded-[32px] anime-border border-reef-blue/10">
                  <div>
                    <h3 className="font-display font-black text-xl text-slate-800 mb-4">Размер (мм)</h3>
                    <input 
                      type="range" 
                      min="30" max="150" step="10"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full accent-reef-blue h-3 bg-white rounded-full appearance-none outline-none anime-border border-white shadow-sm"
                    />
                    <div className="mt-4 text-center font-bold text-reef-blue bg-white py-3 rounded-2xl anime-border border-white shadow-sm">
                      до {size}x{size} мм
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-display font-black text-xl text-slate-800 mb-4">Тираж (шт)</h3>
                    <input 
                      type="number" 
                      min="10" max="1000" step="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-reef-blue focus:outline-none transition-colors text-center font-black text-2xl text-slate-700 shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Summary Sticky Panel */}
            <div className="w-full md:w-96">
              <div className="sticky top-28 bg-reef-blue text-white rounded-[40px] p-10 anime-shadow border-4 border-reef-dark">
                <h3 className="text-2xl font-display font-black mb-8 flex items-center gap-3 text-white drop-shadow-md">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                    <ShoppingBag size={28} />
                  </div>
                  Ваша смета
                </h3>
                
                <div className="space-y-6 mb-10 text-lg font-bold">
                  <div className="flex justify-between border-b-2 border-white/20 pb-4">
                    <span className="opacity-90">За штучку</span>
                    <span className="text-xl">{unitPrice} ₽</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-white/20 pb-4">
                    <span className="opacity-90">Фурнитура</span>
                    <span className="text-reef-light">Включено</span>
                  </div>
                  <div className="flex justify-between pt-4 items-end">
                    <span className="text-xl opacity-90 mb-1">Итого</span>
                    <span className="text-5xl font-display font-black text-reef-light drop-shadow-md">{total.toLocaleString()} ₽</span>
                  </div>
                </div>
                
                <button className="w-full py-5 bg-white text-reef-blue rounded-[24px] font-black text-xl transition-all shadow-[0_6px_0_0_#093f8e] active:shadow-[0_0px_0_0_#093f8e] active:translate-y-[6px] hover:-translate-y-1 hover:shadow-[0_8px_0_0_#093f8e] flex items-center justify-center gap-3">
                  Оформить заказ <ArrowRight size={24} strokeWidth={3} />
                </button>
                
                <p className="mt-8 text-center font-bold opacity-80 text-sm leading-relaxed">
                  * Точная стоимость может немного измениться после проверки макета.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
