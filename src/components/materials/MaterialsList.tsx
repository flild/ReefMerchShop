'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { CheckCircle2, AlertCircle, XCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { InferSelectModel } from 'drizzle-orm';
import { materials, accessories } from '@/db/schema';

type Material = InferSelectModel<typeof materials>;
type Accessory = InferSelectModel<typeof accessories>;

interface MaterialsListProps {
  acrylics: Material[];
  holography: Material[];
  accessoriesData: Accessory[];
}

function getColorClass(name: string) {
  const l = name.toLowerCase();
  if (l.includes('прозрачный')) return 'bg-theme-bg opacity-80 backdrop-blur-md';
  if (l.includes('белый')) return 'bg-white border-theme-border';
  if (l.includes('черный')) return 'bg-black border-theme-border';
  return 'bg-theme-surface';
}

export function MaterialsList({ acrylics, holography, accessoriesData }: MaterialsListProps) {
  return (
    <div className="flex flex-col gap-20">
      {acrylics.length > 0 && (
        <section>
          <h2 className="text-4xl font-display font-black text-theme-text mb-10 flex items-center gap-4">
            <span className="w-12 h-12 bg-theme-accent text-[color:var(--theme-btn-text)] rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_var(--theme-btn-shadow)]">
              <div className="w-6 h-6 border-4 border-current rounded-sm" />
            </span>
            Акрил
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {acrylics.map((item, i) => (
              <MaterialCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {holography.length > 0 && (
        <section>
          <h2 className="text-4xl font-display font-black text-theme-text mb-10 flex items-center gap-4">
            <span className="w-12 h-12 bg-theme-accent text-[color:var(--theme-btn-text)] rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_var(--theme-btn-shadow)]">
              <Sparkles size={24} strokeWidth={3} />
            </span>
            Голография (пленка)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {holography.map((item, i) => (
              <MaterialCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {accessoriesData.length > 0 && (
        <section>
          <h2 className="text-4xl font-display font-black text-theme-text mb-10 flex items-center gap-4">
            <span className="w-12 h-12 bg-theme-accent text-[color:var(--theme-btn-text)] rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_var(--theme-btn-shadow)]">
              <div className="w-6 h-6 border-4 border-current rounded-full" />
            </span>
            Фурнитура
          </h2>
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
          <p className="text-theme-muted mb-4">{item.description}</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-theme-border flex items-center justify-between">
        <div className="font-black text-xl text-theme-accent">
          {item.pricePerCm2}₽ <span className="text-sm font-medium text-theme-muted">/ см²</span>
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
      className="bg-theme-surface rounded-[24px] p-5 anime-border flex flex-col group hover:-translate-y-1 hover:border-theme-accent transition-all shadow-sm hover:shadow-md"
    >
      <div className="w-full h-32 rounded-xl mb-4 bg-theme-bg flex items-center justify-center border border-theme-border overflow-hidden relative">
        {item.imageUrl ? (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover mix-blend-multiply" />
        ) : (
          <ImageIcon size={32} className="text-theme-muted opacity-50 group-hover:opacity-100 transition-opacity" />
        )}
      </div>

      <h3 className="text-lg font-bold text-theme-text mb-1 leading-tight">{item.name}</h3>

      <div className="mt-auto pt-4 flex items-center justify-between">
        <div className="font-bold text-theme-accent">
          {item.price}₽ <span className="text-sm font-normal text-theme-muted">/ шт</span>
        </div>
        <StockBadge status={status} stock={stockLevel} />
      </div>
    </motion.div>
  );
}

function StatusBadge({ available }: { available: boolean }) {
  if (available) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 bg-theme-bg text-theme-text rounded-full text-xs font-bold uppercase tracking-wider border border-theme-border">
        <CheckCircle2 size={14} className="text-theme-accent" /> В наличии
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-theme-bg text-theme-muted rounded-full text-xs font-bold uppercase tracking-wider border border-theme-border opacity-80">
      <XCircle size={14} /> Под заказ
    </div>
  );
}

function StockBadge({ status, stock }: { status: string; stock: number }) {
  if (status === 'out_of_stock') {
    return (
      <div className="flex items-center gap-1 text-theme-muted text-xs font-bold">
        <XCircle size={14} /> Нет
      </div>
    );
  }
  if (status === 'low_stock') {
    return (
      <div className="flex items-center gap-1 text-theme-text text-xs font-bold" title={`Осталось: ${stock} шт.`}>
        <AlertCircle size={14} className="text-theme-accent" /> Мало ({stock})
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-theme-text text-xs font-bold" title={`В наличии: ${stock} шт.`}>
      <CheckCircle2 size={14} className="text-theme-accent" /> {stock > 100 ? 'Много' : stock}
    </div>
  );
}