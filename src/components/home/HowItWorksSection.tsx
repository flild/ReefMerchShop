'use client';

import { motion, Variants } from 'motion/react';
import { UploadCloud, Paintbrush, Scissors, Truck } from 'lucide-react';

const steps = [
  { icon: <UploadCloud size={32} />, title: 'Загрузка', desc: 'Скидываете нам свои макеты через личный кабинет' },
  { icon: <Paintbrush size={32} />, title: 'Проверка', desc: 'Наш дизайнер проверяет файлы на ошибки печати' },
  { icon: <Scissors size={32} />, title: 'Печать и резка', desc: 'Воплощаем идеи в акриле с яркой УФ-печатью' },
  { icon: <Truck size={32} />, title: 'Доставка', desc: 'Бережно упаковываем и отправляем вам!' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-theme-bg relative border-t-4 border-theme-border overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 drop-shadow-sm">Как мы работаем</h2>
          <p className="text-xl text-theme-muted max-w-2xl mx-auto font-medium">Простой путь от вашего макета до готового мерча</p>
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="hidden md:block absolute top-12 left-[10%] right-[10%] h-2 bg-theme-border -z-10 rounded-full origin-left" 
          />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 relative"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center relative group">
                <div className="w-24 h-24 bg-theme-surface rounded-full flex items-center justify-center text-reef-cyan mb-6 shadow-md border-4 border-theme-border group-hover:scale-110 group-hover:bg-theme-bg transition-all duration-300">
                  {step.icon}
                </div>
                <div className="absolute top-0 -right-4 md:right-4 lg:-right-4 w-8 h-8 bg-reef-cyan text-theme-surface rounded-full flex items-center justify-center font-black border-2 border-theme-border shadow-sm">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black text-theme-text mb-3">{step.title}</h3>
                <p className="text-theme-muted font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}