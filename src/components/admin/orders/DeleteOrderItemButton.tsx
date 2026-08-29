'use client';

import { useTransition } from 'react';
import { deleteOrderItem } from '@/actions/admin/orders';

export function DeleteOrderItemButton({ itemId, orderId }: { itemId: string; orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm('Точно удалить этот макет из заказа? Действие необратимо.')) {
      startTransition(() => {
        deleteOrderItem(itemId, orderId);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-theme-surface border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all disabled:opacity-50 z-10 anime-shadow"
      title="Удалить позицию"
    >
      ✕
    </button>
  );
}