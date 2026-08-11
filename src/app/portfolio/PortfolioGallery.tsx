'use client';

import { useState } from 'react';
import Image from 'next/image';
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
    <div className="container mx-auto px-4 max-w-7xl">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6 bg-white p-4 sm:p-6 rounded-[32px] anime-shadow anime-border">
        <div className="flex items-center gap-3 text-slate-700 font-bold">
          <div className="p-2 bg-reef-light rounded-xl text-reef-blue">
            <Filter size={20} />
          </div>
          Фильтры:
        </div>
        
        <div className="flex flex-wrap items-center gap-2 justify-center">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2.5 rounded-2xl font-bold transition-all ${
              activeCategory === 'all' 
                ? 'bg-reef-blue text-white shadow-[0_4px_0_0_#093f8e] -translate-y-1' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            Все работы
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-reef-blue text-white shadow-[0_4px_0_0_#093f8e] -translate-y-1' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div key={item.id} className="group relative rounded-[32px] overflow-hidden bg-white anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-2 transition-all duration-300 flex flex-col">
            <div className="relative aspect-square overflow-hidden bg-slate-50">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => toggleLike(item.id)}
                className="absolute top-4 right-4 p-3 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all text-red-500 z-10"
              >
                <Heart size={20} className={likedItems.has(item.id) ? "fill-current" : ""} />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-display font-black text-slate-800 mb-2">{item.title}</h3>
              {item.authorName && (
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <User size={14} />
                  <span>Автор: <span className="font-bold text-reef-blue">{item.authorName}</span></span>
                </div>
              )}
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center font-bold text-slate-400 text-xl">
            Работ в этой категории пока нет.
          </div>
        )}
      </div>
    </div>
  );
}
