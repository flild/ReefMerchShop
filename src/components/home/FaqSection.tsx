'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  { q: 'Какой минимальный тираж?', a: 'Минимальный тираж зависит от изделия. Для брелоков это обычно от 10 штук одного макета, для стендов — от 5 штук.' },
  { q: 'Сколько времени занимает производство?', a: 'Стандартный срок производства от 7 до 14 рабочих дней после согласования макетов и оплаты. Перед крупными маркетами сроки могут быть увеличены.' },
  { q: 'Какие требования к макетам?', a: 'Мы принимаем макеты в форматах PSD, AI, PDF. Цветовая модель CMYK. Разрешение не менее 300 dpi. Обязательно наличие слоя с контуром реза и белой подложкой.' },
  { q: 'Доставляете ли вы в другие города?', a: 'Да, мы отправляем готовые заказы по всей России через СДЭК или Почту России. Возможна отправка в другие страны (обсуждается индивидуально).' },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-24 bg-theme-bg relative border-t-4 border-theme-border overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 drop-shadow-sm">Вопросы и ответы</h2>
        </motion.div>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group bg-theme-surface rounded-2xl anime-border shadow-sm overflow-hidden transition-all ${isOpen ? 'anime-shadow' : ''}`}
              >
                <button
                  onClick={() => toggleOpen(i)}
                  className="w-full flex items-center justify-between p-6 cursor-pointer text-left text-xl font-bold text-theme-text hover:text-theme-highlight transition-colors outline-none"
                >
                  {faq.q}
                  <span
                    className={`transition-transform duration-300 bg-theme-bg rounded-full p-2 text-theme-highlight shrink-0 ml-4 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    <ChevronDown size={24} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="p-6 pt-0 text-theme-muted font-medium text-lg leading-relaxed border-t-2 border-theme-border">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}