'use client';

import { motion } from 'motion/react';
import { UploadCloud, Paintbrush, Scissors, Truck, ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
  { icon: <UploadCloud size={40} strokeWidth={2} />, title: 'Загрузка', desc: 'Заливаете макеты через личный кабинет или скидываете менеджеру.' },
  { icon: <Paintbrush size={40} strokeWidth={2} />, title: 'Проверка', desc: 'Наш дизайнер проверяет слои, вылеты и контуры реза.' },
  { icon: <Scissors size={40} strokeWidth={2} />, title: 'Печать', desc: 'Наносим УФ-печать, режем лазером и собираем с фурнитурой.' },
  { icon: <Truck size={40} strokeWidth={2} />, title: 'Получение', desc: 'Доставка СДЭКом по РФ или самовывоз из студии в Санкт-Петербурге.' },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-theme-surface relative border-t-4 border-theme-border overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 drop-shadow-sm">Как строится работа</h2>
          <p className="text-xl text-theme-muted max-w-2xl mx-auto font-medium">Весь путь от вашего исходника до готового изделия в руках</p>
        </motion.div>
        
        {/* Меняем flex на grid для жесткой фиксации равных колонок */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto relative">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col relative w-full group">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, type: "spring", bounce: 0.4 }}
                className="w-full h-full bg-theme-bg p-6 lg:p-8 rounded-[32px] anime-border anime-shadow flex flex-col items-center text-center relative z-10 hover:-translate-y-2 hover:anime-shadow-hover transition-all"
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-theme-accent text-theme-surface rounded-full flex items-center justify-center font-black text-xl border-4 border-theme-border shadow-sm rotate-12 group-hover:rotate-0 transition-transform">
                  {i + 1}
                </div>
                
                <div className="w-20 h-20 shrink-0 bg-theme-surface rounded-2xl border-2 border-theme-border flex items-center justify-center text-theme-text mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  {step.icon}
                </div>
                
                <h3 className="text-xl lg:text-2xl font-black text-theme-text mb-3">{step.title}</h3>
                <p className="text-theme-muted font-medium leading-relaxed flex-1">{step.desc}</p>
              </motion.div>

              {/* Десктопная стрелка: вырвана из потока и центрируется ровно в gap */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2 }}
                  className="hidden md:flex absolute top-1/2 left-full -translate-x-1/2 ml-3 lg:ml-4 -translate-y-1/2 z-20 text-theme-accent pointer-events-none"
                >
                  <ArrowRight size={40} strokeWidth={3} className="drop-shadow-sm group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}

              {/* Мобильная стрелка: остается в потоке сетки */}
              {i < steps.length - 1 && (
                <div className="md:hidden py-4 text-theme-accent flex justify-center w-full">
                  <ArrowDown size={32} strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}