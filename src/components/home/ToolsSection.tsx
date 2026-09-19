'use client';

import Link from 'next/link';
import { motion, Variants } from 'motion/react';
import { ArrowRight, Calculator, Image as ImageIcon, BoxSelect, CheckSquare } from 'lucide-react';

const tools = [
  {
    href: '/calculator',
    icon: <Calculator size={36} strokeWidth={2.5} />,
    title: 'Калькулятор 2.0',
    desc: 'Точный расчет стоимости с учетом материалов, фурнитуры и тиража.',
    bgClass: 'bg-theme-bg',
    iconBgClass: 'bg-theme-surface',
    active: true,
  },
  {
    href: '#',
    icon: <BoxSelect size={36} strokeWidth={2.5} />,
    title: '3D Превью',
    desc: 'Примерьте свой арт на прозрачный, жемчужный или цветной акрил онлайн.',
    bgClass: 'bg-theme-surface opacity-70 grayscale-[30%]',
    iconBgClass: 'bg-theme-bg',
    active: false,
  },
  {
    href: '#',
    icon: <CheckSquare size={36} strokeWidth={2.5} />,
    title: 'Валидатор макетов',
    desc: 'Автоматическая проверка ваших макетов на соответствие техническим требованиям.',
    bgClass: 'bg-theme-bg opacity-70 grayscale-[30%]',
    iconBgClass: 'bg-theme-surface',
    active: false,
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
};

export function ToolsSection() {
  return (
    <section className="py-24 bg-theme-surface relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 drop-shadow-sm">
            Инструменты для художников
          </h2>
          <p className="text-xl text-theme-muted max-w-2xl mx-auto font-medium">
            Мы сделали всё, чтобы подготовка и расчет заказа были максимально простыми и приятными.
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {tools.map((tool, i) => {
            const Wrapper = tool.active ? Link : 'div';
            return (
              <motion.div key={i} variants={itemVariants}>
                <Wrapper
                  href={tool.href as any}
                  className={`${tool.bgClass} relative rounded-[40px] p-10 anime-border anime-shadow transition-all group block h-full flex flex-col ${tool.active ? 'hover:anime-shadow-hover hover:-translate-y-2' : 'cursor-not-allowed'}`}
                >
                  {!tool.active && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-xs font-black border-2 border-theme-border shadow-[3px_3px_0_0_var(--theme-border)] bg-theme-yellow-bg text-theme-yellow-text rotate-[3deg]">
                      Скоро...
                    </div>
                  )}
                  <div className={`w-20 h-20 ${tool.iconBgClass} rounded-3xl flex items-center justify-center text-reef-cyan mb-8 shadow-sm transition-transform anime-border ${tool.active ? `group-hover:scale-110 group-hover:${i % 2 === 0 ? 'rotate-6' : '-rotate-6'}` : ''}`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-2xl font-display font-black text-theme-text mb-4">{tool.title}</h3>
                  <p className="text-lg text-theme-muted mb-8 font-medium flex-1">{tool.desc}</p>
                  <div className="text-reef-cyan font-bold flex items-center gap-2 transition-all text-lg mt-auto">
                    {tool.active ? (
                      <>
                        Перейти <ArrowRight size={24} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      <span className="text-theme-muted">В разработке</span>
                    )}
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}