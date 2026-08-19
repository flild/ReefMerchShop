'use client';

import { useTransition } from 'react';
import { deleteMaterial } from '@/actions/admin/inventory';
import { Trash2 } from 'lucide-react';

export function DeleteMaterialButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно удалить этот материал? Если он привязан к существующим заказам, база может послать тебя нахер.')) return;
    
    startTransition(async () => {
      await deleteMaterial(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-yellow-text hover:border-theme-yellow-text transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Удалить"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}