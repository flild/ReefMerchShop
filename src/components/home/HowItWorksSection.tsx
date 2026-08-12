'use client';

import { motion } from 'motion/react';
import { UploadCloud, Paintbrush, Scissors, Truck, ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
  { icon: <UploadCloud size={40} strokeWidth={2} />, title: 'Загрузка', desc: 'Заливаете макеты через личный кабинет или скидываете менеджеру.' },
  { icon: <Paintbrush size={40} strokeWidth={2} />, title: 'Проверка', desc: 'Наш дизайнер проверяет слои, вылеты и контуры реза.' },
  { icon: <Scissors size={40} strokeWidth={2} />, title: 'Печать', desc: 'Наносим УФ-печать, режем лазером и собираем с фурнитурой.' },
  { icon: <Truck size={40} strokeWidth={2} />, title: 'Отправка', desc: 'Упаковываем в пленку и отправляем СДЭКом или Почтой.' },
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
        
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto relative gap-4 lg:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center flex-1 relative w-full group">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, type: "spring", bounce: 0.4 }}
                className="w-full bg-theme-bg p-8 rounded-[32px] anime-border anime-shadow flex flex-col items-center text-center relative z-10 hover:-translate-y-2 hover:anime-shadow-hover transition-all"
              >
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-reef-cyan text-slate-900 rounded-full flex items-center justify-center font-black text-xl border-4 border-theme-border shadow-sm rotate-12 group-hover:rotate-0 transition-transform">
                  {i + 1}
                </div>
                
                <div className="w-20 h-20 bg-theme-surface rounded-2xl border-2 border-theme-border flex items-center justify-center text-theme-text mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  {step.icon}
                </div>
                
                <h3 className="text-2xl font-black text-theme-text mb-3">{step.title}</h3>
                <p className="text-theme-muted font-medium leading-relaxed">{step.desc}</p>
              </motion.div>

              {/* Стрелка между шагами (скрыта на последнем) */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.2 }}
                  className="hidden md:flex items-center justify-center mx-2 lg:mx-4 text-theme-border shrink-0 z-0"
                >
                  <ArrowRight size={48} strokeWidth={3} className="group-hover:translate-x-2 transition-transform text-reef-cyan" />
                </motion.div>
              )}

              {/* Стрелка вниз для мобилки */}
              {i < steps.length - 1 && (
                <div className="md:hidden py-4 text-reef-cyan">
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