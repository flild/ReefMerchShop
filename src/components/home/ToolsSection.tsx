'use client';

import Link from 'next/link';
import { motion, Variants } from 'motion/react';
import { ArrowRight, Calculator, Image as ImageIcon, Package } from 'lucide-react';

const tools = [
  {
    href: '/calculator',
    icon: <Calculator size={36} strokeWidth={2.5} />,
    title: 'Калькулятор 2.0',
    desc: 'Точный расчет стоимости с учетом материалов, фурнитуры и тиража.',
    bgClass: 'bg-reef-light',
    iconBgClass: 'bg-white',
  },
  {
    href: '/tools/mockup',
    icon: <ImageIcon size={36} strokeWidth={2.5} />,
    title: 'Мокап-генератор',
    desc: 'Примерьте свой арт на прозрачный, жемчужный или цветной акрил онлайн.',
    bgClass: 'bg-white',
    iconBgClass: 'bg-reef-light',
  },
  {
    href: '/collects',
    icon: <Package size={36} strokeWidth={2.5} />,
    title: 'Коллекты',
    desc: 'Совместные заказы для снижения стоимости производства мерча.',
    bgClass: 'bg-reef-light',
    iconBgClass: 'bg-white',
  },
];

// Явно указываем тип Variants
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
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-6 drop-shadow-sm">
            Инструменты для художников
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
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
          {tools.map((tool, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link 
                href={tool.href} 
                className={`${tool.bgClass} rounded-[40px] p-10 anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all group block h-full flex flex-col`}
              >
                <div className={`w-20 h-20 ${tool.iconBgClass} rounded-3xl flex items-center justify-center text-reef-blue mb-8 shadow-sm group-hover:scale-110 group-hover:${i % 2 === 0 ? 'rotate-6' : '-rotate-6'} transition-transform anime-border`}>
                  {tool.icon}
                </div>
                <h3 className="text-2xl font-display font-black text-slate-800 mb-4">{tool.title}</h3>
                <p className="text-lg text-slate-600 mb-8 font-medium flex-1">{tool.desc}</p>
                <div className="text-reef-blue font-bold flex items-center gap-2 group-hover:gap-4 transition-all text-lg mt-auto">
                  Перейти <ArrowRight size={24} strokeWidth={3} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}