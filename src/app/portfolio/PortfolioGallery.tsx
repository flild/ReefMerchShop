'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, User, Heart } from 'lucide-react';

type PortfolioItem = {
  id: string;
  categoryId: string | null;
  title: string;
  description: string | null;
  imageUrl: string;
  authorName: string | null;
};

type Category = {
  id: string;
  name: string;
};

export default function PortfolioGallery({ 
  items, 
  categories 
}: { 
  items: PortfolioItem[], 
  categories: Category[] 
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    const newLikes = new Set(likedItems);
    if (newLikes.has(id)) {
      newLikes.delete(id);
    } else {
      newLikes.add(id);
    }
    setLikedItems(newLikes);
  };

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.categoryId === activeCategory);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 bg-theme-surface p-4 sm:p-6 rounded-[32px] anime-shadow anime-border">
        <div className="flex items-center gap-3 text-theme-text font-black text-lg">
          <div className="p-3 bg-theme-bg rounded-2xl text-theme-highlight anime-border shadow-sm">
            <Filter size={24} strokeWidth={2.5} />
          </div>
          Фильтры:
        </div>
        
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end flex-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
              activeCategory === 'all' 
                ? 'bg-theme-accent text-[var(--theme-btn-text)] shadow-[0_4px_0_0_var(--theme-btn-shadow)] border-transparent -translate-y-1' 
                : 'bg-theme-bg text-theme-muted border-theme-border hover:border-theme-highlight/50 hover:text-theme-text hover:-translate-y-1'
            }`}
          >
            Все работы
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all border-2 ${
                activeCategory === cat.id
                  ? 'bg-theme-accent text-[var(--theme-btn-text)] shadow-[0_4px_0_0_var(--theme-btn-shadow)] border-transparent -translate-y-1' 
                  : 'bg-theme-bg text-theme-muted border-theme-border hover:border-theme-highlight/50 hover:text-theme-text hover:-translate-y-1'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid with smooth filtering animations */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map(item => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              key={item.id} 
              className="group relative rounded-[32px] overflow-hidden bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-square overflow-hidden bg-theme-bg border-b-2 border-theme-border">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <button 
                  onClick={() => toggleLike(item.id)}
                  className="absolute top-4 right-4 p-3 bg-theme-surface/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all text-rose-500 z-10 border-2 border-theme-border"
                >
                  <Heart size={20} className={likedItems.has(item.id) ? "fill-current" : ""} />
                </button>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-display font-black text-theme-text mb-4">{item.title}</h3>
                
                {item.authorName && (
                  <div className="mt-auto flex items-center gap-2 text-theme-muted font-medium text-sm bg-theme-bg px-4 py-2 rounded-xl w-fit border border-theme-border">
                    <User size={14} className="text-theme-highlight" />
                    <span>Автор: <span className="font-bold text-theme-text">{item.authorName}</span></span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full py-20 text-center bg-theme-surface anime-border rounded-[40px] anime-shadow mt-8"
        >
          <p className="font-bold text-theme-muted text-xl">Работ в этой категории пока нет.</p>
        </motion.div>
      )}
    </div>
  );
}