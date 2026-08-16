'use client';

import { useTransition } from 'react';
import { toggleCollectStatus } from '@/actions/admin/collects';

interface Props {
  id: string;
  status: string;
}

export function CollectStatusToggle({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();
  const isOpen = status === 'open';

  const handleToggle = () => {
    startTransition(async () => {
      await toggleCollectStatus(id, status);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-2 rounded-[16px] font-extrabold text-sm border-2 transition-all anime-shadow hover:anime-shadow-hover disabled:opacity-50 disabled:cursor-not-allowed ${
        isOpen 
          ? 'bg-theme-green-bg text-theme-green-text border-theme-green-text' 
          : 'bg-theme-gray-bg text-theme-gray-text border-theme-gray-text'
      }`}
    >
      {isPending ? 'Загрузка...' : (isOpen ? 'СТАТУС: ОТКРЫТ' : 'СТАТУС: ЗАКРЫТ')}
    </button>
  );
}