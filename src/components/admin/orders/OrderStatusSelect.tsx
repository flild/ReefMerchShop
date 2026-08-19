'use client';

import { useTransition } from 'react';
import { updateOrderStatus } from '@/actions/admin/orders';

const STATUSES = {
  'new': 'Новый',
  'layout': 'Верстка',
  'proofing': 'Цветопроба',
  'production': 'В производстве',
  'shipping': 'Отправка',
  'completed': 'Завершен',
} as const;

// Строго семантические цвета из дизайн-системы
const getStatusColors = (status: string) => {
  switch (status) {
    case 'new': 
      return 'bg-theme-bg border-theme-highlight text-theme-highlight';
    case 'proofing': 
      return 'bg-theme-yellow-bg border-transparent text-theme-yellow-text';
    case 'completed': 
      return 'bg-theme-green-bg border-transparent text-theme-green-text';
    case 'shipping': 
      return 'bg-theme-gray-bg border-transparent text-theme-gray-text';
    case 'production':
      return 'bg-theme-bg border-theme-text text-theme-text';
    case 'layout':
    default: 
      return 'bg-theme-surface border-theme-border text-theme-text';
  }
};

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

  const colorClasses = getStatusColors(currentStatus);

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`border-2 rounded-[16px] px-3 py-2 font-bold outline-none focus:border-theme-highlight anime-shadow transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 min-w-[140px] ${colorClasses}`}
    >
      {Object.entries(STATUSES).map(([key, label]) => (
        <option key={key} value={key} className="bg-theme-bg text-theme-text">
          {label}
        </option>
      ))}
    </select>
  );
}