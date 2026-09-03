'use client';

import { useTransition } from 'react';
import { updateUserRole } from '@/actions/admin/users';
import { ROLES } from '@/config/roles';

interface Props {
  userId: string;
  currentRole: string;
  isSelf?: boolean;
}

export function RoleSelect({ userId, currentRole, isSelf = false }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    if (currentRole === 'admin' && newRole !== 'admin') {
      if (!confirm('Точно снять права администратора с этого аккаунта?')) {
        e.target.value = currentRole;
        return;
      }
    }

    startTransition(async () => {
      const res = await updateUserRole(userId, newRole);
      if (res?.error) {
        alert(res.error);
        e.target.value = currentRole;
      }
    });
  };

  const options = { ...ROLES } as Record<string, string>;
  if (!options[currentRole]) {
    options[currentRole] = currentRole;
  }

  return (
    <div className="relative inline-block" title={isSelf ? 'Вы не можете изменить собственную роль' : undefined}>
      <select
        value={currentRole}
        onChange={handleChange}
        disabled={isPending || isSelf}
        className={`bg-theme-bg border-2 rounded-[16px] px-3 py-2 font-bold outline-none anime-shadow transition-all text-sm appearance-none min-w-[130px] ${
          isSelf ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
        } ${
          currentRole === 'admin' ? 'border-theme-highlight text-theme-highlight' : 
          currentRole === 'manager' ? 'border-theme-green-text text-theme-green-text' : 
          'border-theme-border text-theme-text focus:border-theme-highlight'
        }`}
      >
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}