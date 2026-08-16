'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from '@/actions/admin/orders';

// Семантические статусы по ТЗ
const STATUSES = {
  'new': 'Новый',
  'layout': 'Верстка',
  'proofing': 'Цветопроба',
  'production': 'В производстве',
  'shipping': 'Отправка',
  'completed': 'Завершен',
} as const;

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="bg-theme-bg border-2 border-theme-border rounded-[16px] px-3 py-2 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 min-w-[140px]"
    >
      {Object.entries(STATUSES).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}