'use client';

import { motion, Variants } from 'motion/react';
import { Quote, Star } from 'lucide-react';

const reviews = [
  { name: 'Kitsu_Art', text: 'Заказывала партию стендов на маркет, всё пришло идеально упаковано. Качество печати — огонь, цвета яркие и сочные!' },
  { name: 'MikaDraws', text: 'Очень удобный калькулятор на сайте. Сразу видно, сколько выйдет заказ. Сделали всё в срок, спасибо огромное!' },
  { name: 'PixelGhost', text: 'Голографический акрил просто волшебный. Брелоки разлетелись в первый же день маркета. Буду заказывать еще 100%.' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
};

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-theme-surface relative border-t-4 border-theme-border overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6 drop-shadow-sm">Что говорят художники</h2>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {reviews.map((review, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-theme-bg rounded-[40px] p-8 anime-border anime-shadow relative flex flex-col justify-between hover:-translate-y-1 hover:anime-shadow-hover transition-all cursor-default">
              <div>
                <Quote size={48} className="text-reef-cyan/20 absolute top-6 right-6" />
                <div className="flex text-yellow-400 mb-6 gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={20} className="fill-current" />)}
                </div>
                <p className="text-lg text-theme-text font-medium italic mb-6 leading-relaxed">«{review.text}»</p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-reef-cyan text-theme-surface flex items-center justify-center font-black border-2 border-theme-border text-xl shadow-sm">
                  {review.name.charAt(0)}
                </div>
                <div className="font-bold text-theme-text text-lg">{review.name}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}