'use client';

import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Какой минимальный тираж?', a: 'Минимальный тираж зависит от изделия. Для брелоков это обычно от 10 штук одного макета, для стендов — от 5 штук.' },
  { q: 'Сколько времени занимает производство?', a: 'Стандартный срок производства от 7 до 14 рабочих дней после согласования макетов и оплаты. Перед крупными маркетами сроки могут быть увеличены.' },
  { q: 'Какие требования к макетам?', a: 'Мы принимаем макеты в форматах PSD, AI, PDF. Цветовая модель CMYK. Разрешение не менее 300 dpi. Обязательно наличие слоя с контуром реза и белой подложкой.' },
  { q: 'Доставляете ли вы в другие города?', a: 'Да, мы отправляем готовые заказы по всей России через СДЭК или Почту России. Возможна отправка в другие страны (обсуждается индивидуально).' },
];

export function FaqSection() {
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
          {faqs.map((faq, i) => (
            <motion.details 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-theme-surface rounded-2xl anime-border shadow-sm overflow-hidden open:anime-shadow transition-all"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none text-xl font-bold text-theme-text hover:text-theme-highlight transition-colors outline-none [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="transition-transform group-open:rotate-180 bg-theme-bg rounded-full p-2 text-theme-highlight shrink-0 ml-4">
                  <ChevronDown size={24} />
                </span>
              </summary>
              <div className="p-6 pt-0 text-theme-muted font-medium text-lg leading-relaxed border-t-2 border-theme-border">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}