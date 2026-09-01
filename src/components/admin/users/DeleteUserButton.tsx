'use client';

import { useTransition } from 'react';
import { deleteUser } from '@/actions/admin/users';
import { Trash2 } from 'lucide-react';

export function DeleteUserButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm('Точно снести этого пользователя? Действие необратимо.')) return;
    startTransition(async () => {
      await deleteUser(userId);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-rose-500 hover:border-rose-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      title="Удалить"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}