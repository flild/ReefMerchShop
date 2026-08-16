'use client';

import { useTransition } from 'react';
import { deletePortfolioItem } from '@/actions/admin/portfolio';
import { Trash2 } from 'lucide-react';

export function DeletePortfolioButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно удалить эту работу из базы?')) return;
    startTransition(async () => {
      await deletePortfolioItem(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Удалить"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}