// src/components/admin/inventory/DeleteButton.tsx
'use client';

import { useTransition } from 'react';
import { deleteItem } from '@/actions/admin/inventory';
import { Trash2 } from 'lucide-react';

export function DeleteButton({ id, type }: { id: string, type: 'material' | 'accessory' | 'blank' }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно удалить? Если оно привязано к заказам, будет ошибка.')) return;
    
    startTransition(async () => {
      await deleteItem(id, type);
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