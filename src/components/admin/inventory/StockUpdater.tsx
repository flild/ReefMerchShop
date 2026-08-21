'use client';

import { useTransition } from 'react';
import { updateStock } from '@/actions/admin/inventory';

interface StockUpdaterProps {
  id: string;
  currentStock: number;
  type: 'material' | 'accessory' | 'blank';
}

export function StockUpdater({ id, currentStock, type }: StockUpdaterProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stockValue = Number(formData.get('stock'));
    
    if (isNaN(stockValue) || stockValue < 0) return;

    startTransition(async () => {
      await updateStock(id, stockValue, type);
    });
  };

  return (
    <form onSubmit={handleUpdate} className="flex items-center gap-3">
      <input 
        type="number" 
        name="stock" 
        defaultValue={currentStock}
        min="0"
        className="w-24 bg-theme-bg border-2 border-theme-border rounded-full px-4 py-2 font-bold text-center text-theme-text outline-none focus:border-theme-highlight transition-colors anime-shadow [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
      />
      <button 
        type="submit" 
        disabled={isPending}
        className="anime-button px-5 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? '...' : 'Save'}
      </button>
    </form>
  );
}