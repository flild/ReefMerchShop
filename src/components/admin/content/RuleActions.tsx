'use client';

import { useTransition } from 'react';
import { toggleRuleStatus, deleteRule } from '@/actions/admin/checklist';
import { Trash2 } from 'lucide-react';

export function RuleStatusToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleRuleStatus(id, isActive);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border-2 transition-all disabled:opacity-50 ${
        isActive 
          ? 'bg-theme-green-bg text-theme-green-text border-theme-green-text' 
          : 'bg-theme-gray-bg text-theme-gray-text border-theme-gray-text'
      }`}
    >
      {isActive ? 'Активно' : 'Отключено'}
    </button>
  );
}

export function DeleteRuleButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно удалить это правило?')) return;
    startTransition(async () => {
      await deleteRule(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-theme-muted hover:text-theme-highlight transition-colors disabled:opacity-50"
      title="Удалить правило"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}