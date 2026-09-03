// src/components/admin/inventory/DeleteButton.tsx
'use client';

import { useTransition } from 'react';
import { deleteItem } from '@/actions/admin/inventory';
import { Trash2 } from 'lucide-react';

export interface DeleteButtonProps {
  id: string;
  type: 'material' | 'accessory' | 'blank' | 'type';
}

export function DeleteButton({ id, type }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно удалить эту позицию? Действие необратимо.')) return;
    
    startTransition(async () => {
      const res = await deleteItem(id, type);
      if (res && !res.success) {
        alert(res.error);
      }
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