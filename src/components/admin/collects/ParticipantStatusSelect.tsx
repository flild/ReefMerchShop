'use client';

import { useTransition } from 'react';
import { updateParticipantStatus } from '@/actions/admin/collects';
import { toast } from 'sonner';

const STATUSES = {
  'new': 'Новая (ждет макетов)',
  'layouts_uploaded': 'Макеты загружены',
  'needs_fixes': 'Нужны правки',
  'approved': 'Одобрен',
  'pending_payment': 'Ожидает оплаты',
  'paid': 'Оплачен',
  'production': 'В производстве',
} as const;

interface Props {
  participantId: string;
  currentStatus: string;
  collectId: string;
  canManagePayments?: boolean;
}

export function ParticipantStatusSelect({ participantId, currentStatus, collectId, canManagePayments = true }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    startTransition(async () => {
      const result = await updateParticipantStatus(participantId, newStatus, collectId);
      if (result.error) toast.error(result.error);
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`bg-theme-bg border-2 rounded-[16px] px-3 py-2 font-bold outline-none anime-shadow transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 min-w-[160px] ${
        currentStatus === 'paid' || currentStatus === 'approved' ? 'border-theme-green-text text-theme-green-text' : 
        currentStatus === 'production' ? 'border-theme-highlight text-theme-highlight' : 
        currentStatus === 'needs_fixes' ? 'border-theme-yellow-text text-theme-yellow-text' :
        'border-theme-border text-theme-text focus:border-theme-highlight'
      }`}
    >
      {Object.entries(STATUSES).filter(([key]) => canManagePayments || !['paid', 'pending_payment'].includes(key) || key === currentStatus).map(([key, label]) => (
        <option key={key} value={key} disabled={!canManagePayments && ['paid', 'pending_payment'].includes(key)}>
          {label}
        </option>
      ))}
    </select>
  );
}
