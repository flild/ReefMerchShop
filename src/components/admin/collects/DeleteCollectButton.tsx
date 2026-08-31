'use client';

import { useTransition } from 'react';
import { deleteCollect } from '@/actions/admin/collects';

export function DeleteCollectButton({ id, title }: { id: string; title: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm(`Ты уверен, что хочешь безвозвратно удалить коллект "${title}"? Все заявки участников тоже будут удалены.`)) {
      startTransition(async () => {
        await deleteCollect(id);
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="px-5 py-2 rounded-[20px] bg-theme-surface border-2 border-theme-yellow-text text-theme-yellow-text font-bold hover:bg-theme-yellow-text hover:text-theme-bg transition-colors disabled:opacity-50"
    >
      {isPending ? 'Удаляем...' : 'Удалить'}
    </button>
  );
}