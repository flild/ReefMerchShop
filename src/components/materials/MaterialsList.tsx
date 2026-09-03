// src/components/materials/MaterialsList.tsx
'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Sparkles, Image as ImageIcon, Box } from 'lucide-react';
import type { InferSelectModel } from 'drizzle-orm';
import { materials, accessories, materialTypes } from '@/db/schema';

type Material = InferSelectModel<typeof materials>;
type Accessory = InferSelectModel<typeof accessories>;
type MaterialType = InferSelectModel<typeof materialTypes>;

export interface MaterialGroup {
  type: MaterialType;
  items: Material[];
}

interface MaterialsListProps {
  groups: MaterialGroup[];
  accessoriesData: Accessory[];
}

function getColorClass(name: string) {
  const l = name.toLowerCase();
  if (l.includes('прозрачный')) return 'bg-theme-bg opacity-80 backdrop-blur-md';
  if (l.includes('белый')) return 'bg-white border-theme-border';
  if (l.includes('черный')) return 'bg-black border-theme-border';
  return 'bg-theme-surface';
}

export function MaterialsList({ groups, accessoriesData }: MaterialsListProps) {
  return (
    <div className="flex flex-col gap-20">
      {groups.map((group) => (
        <section key={group.type.id}>
          <div className="mb-10">
            <h2 className="text-4xl font-display font-black text-theme-text flex items-center gap-4">
              <span className="w-12 h-12 bg-theme-accent text-[color:var(--theme-btn-text)] rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_var(--theme-btn-shadow)]">
                {group.type.slug === 'holography' ? (
                  <Sparkles size={24} strokeWidth={3} />
                ) : (
                  <Box size={24} strokeWidth={2.5} />
                )}
              </span>
              {group.type.name}
            </h2>
            {group.type.description && (
              <p className="text-theme-muted text-lg font-bold mt-2 ml-16">
                {group.type.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {group.items.map((item, i) => (
              <MaterialCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      ))}

      {accessoriesData.length > 0 && (
        <section>
          <div className="mb-10">
            <h2 className="text-4xl font-display font-black text-theme-text flex items-center gap-4">
              <span className="w-12 h-12 bg-theme-accent text-[color:var(--theme-btn-text)] rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_var(--theme-btn-shadow)]">
                <div className="w-6 h-6 border-4 border-current rounded-full" />
              </span>
              Фурнитура
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-4 gap-8">
            {accessoriesData.map((item, i) => (
              <AccessoryCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MaterialCard({ item, index }: { item: Material; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-theme-surface rounded-[32px] p-6 anime-border anime-shadow group hover:anime-shadow-hover hover:-translate-y-2 transition-all flex flex-col"
    >
      <div className="w-full h-48 rounded-2xl mb-6 bg-theme-bg flex items-center justify-center relative overflow-hidden border-2 border-theme-border">
        <div className="absolute inset-0 bg-gradient-to-br from-theme-surface/40 to-transparent z-10" />
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
        ) : (
          <div className={`w-3/4 h-3/4 rounded-xl border border-theme-border flex items-center justify-center ${getColorClass(item.name)}`}>
            <ImageIcon size={32} className="text-theme-muted opacity-50" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-bold text-theme-text mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-theme-muted mb-4 text-sm font-medium leading-relaxed">{item.description}</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-theme-border flex items-center justify-between">
        <div className="font-black text-xl text-theme-highlight">
          {item.pricePerCm2} ₽ <span className="text-sm font-medium text-theme-muted">/ см²</span>
        </div>
        <StatusBadge available={item.inStock} />
      </div>
    </motion.div>
  );
}

function AccessoryCard({ item, index }: { item: Accessory; index: number }) {
  const stockLevel = item.stock;
  let status = 'available';
  if (stockLevel === 0) status = 'out_of_stock';
  else if (stockLevel < item.minStock) status = 'low_stock';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-theme-surface rounded-[24px] p-5 anime-border anime-shadow flex flex-col group hover:-translate-y-2 hover:anime-shadow-hover transition-all"
    >
      <div className="w-full h-32 rounded-xl mb-4 bg-theme-bg flex items-center justify-center border-2 border-theme-border overflow-hidden relative">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-2" />
        ) : (
          <ImageIcon size={32} className="text-theme-muted opacity-50 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      <h3 className="text-lg font-bold text-theme-text mb-1 leading-tight">{item.name}</h3>

      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="font-bold text-theme-highlight">
          {item.price} ₽ <span className="text-sm font-normal text-theme-muted">/ шт</span>
        </div>
        <AccessoryStockBadge status={status} stock={stockLevel} />
      </div>
    </motion.div>
  );
}

function StatusBadge({ available }: { available: boolean }) {
  if (available) {
    return (
      <div className="px-3 py-1 bg-theme-green-bg text-theme-green-text rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-3deg]">
        В наличии
      </div>
    );
  }
  return (
    <div className="px-3 py-1 bg-theme-gray-bg text-theme-gray-text rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[3deg]">
      Под заказ
    </div>
  );
}

function AccessoryStockBadge({ status, stock }: { status: string; stock: number }) {
  if (status === 'out_of_stock') {
    return (
      <div className="px-3 py-1 bg-theme-gray-bg text-theme-gray-text rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[3deg]">
        Нет
      </div>
    );
  }
  if (status === 'low_stock') {
    return (
      <div className="px-3 py-1 bg-theme-yellow-bg text-theme-yellow-text rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-2deg]">
        Мало ({stock})
      </div>
    );
  }
  return (
    <div className="px-3 py-1 bg-theme-green-bg text-theme-green-text rounded-full text-xs font-black uppercase tracking-wider border-2 border-theme-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-2deg]">
      {stock > 100 ? 'Много' : `${stock} шт`}
    </div>
  );
}