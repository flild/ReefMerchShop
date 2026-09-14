'use client';

import { useTransition } from 'react';
import { deleteChecklistTemplate } from '@/actions/admin/checklists';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function DeleteChecklistTemplateButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm('Удалить этот шаблон? Восстановить будет невозможно.')) {
      startTransition(async () => {
        await deleteChecklistTemplate(id);
        toast.success('Шаблон удален');
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-theme-red-text hover:bg-theme-red-bg rounded-xl transition-colors disabled:opacity-50"
      title="Удалить"
    >
      <Trash2 size={18} />
    </button>
  );
}
