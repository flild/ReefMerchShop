// src/components/admin/collects/CollectStatusManager.tsx
'use client';

import { useTransition } from 'react';
import { updateCollectStatus } from '@/actions/admin/collects';

interface Props {
  id: string;
  currentStatus: string;
}

const STATUSES = {
  'open': 'Набор открыт',
  'review': 'На проверке',
  'in_progress': 'В работе',
  'completed': 'Сдан',
} as const;

export function CollectStatusManager({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateCollectStatus(id, newStatus);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`bg-theme-bg border-2 border-theme-border rounded-[16px] px-3 py-1.5 font-bold outline-none anime-shadow hover:anime-shadow-hover transition-all text-sm cursor-pointer disabled:opacity-50 focus:border-theme-highlight ${
        isPending ? 'animate-pulse' : ''
      }`}
    >
      {Object.entries(STATUSES).map(([key, label]) => (
        <option key={key} value={key} className="font-bold">
          {label}
        </option>
      ))}
    </select>
  );
}