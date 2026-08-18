'use client';

import { useTransition } from 'react';
import { toggleArticlePublish, deleteArticle } from '@/actions/admin/articles';
import { Trash2 } from 'lucide-react';

export function PublishToggle({ id, isPublished }: { id: string; isPublished: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleArticlePublish(id, isPublished);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border-2 transition-all disabled:opacity-50 ${
        isPublished 
          ? 'bg-theme-green-bg text-theme-green-text border-theme-green-text' 
          : 'bg-theme-gray-bg text-theme-gray-text border-theme-gray-text'
      }`}
    >
      {isPending ? '...' : isPublished ? 'Опубликовано' : 'Черновик'}
    </button>
  );
}

export function DeleteArticleButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Снести статью? Это действие не отменить.')) return;
    startTransition(async () => {
      await deleteArticle(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-theme-muted hover:text-theme-highlight transition-colors disabled:opacity-50"
      title="Удалить статью"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}