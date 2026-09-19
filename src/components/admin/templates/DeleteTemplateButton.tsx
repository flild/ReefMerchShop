'use client';

import { useTransition } from 'react';
import { deleteTemplate } from '@/actions/admin/templates';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteTemplateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно удалить этот шаблон?')) return;

    startTransition(async () => {
      const res = await deleteTemplate(id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success('Шаблон удален');
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-red-500 hover:border-red-500 transition-all disabled:opacity-50"
      title="Удалить"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
