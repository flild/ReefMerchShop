'use client';

import { useTransition } from 'react';
import { deleteTemplate } from '@/actions/admin/templates';
import { Trash2 } from 'lucide-react';

export function DeleteTemplateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно снести этот шаблон из базы?')) return;
    
    startTransition(async () => {
      await deleteTemplate(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Удалить шаблон"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}