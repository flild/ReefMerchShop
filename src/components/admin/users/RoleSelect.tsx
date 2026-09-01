'use client';

import { useTransition } from 'react';
import { updateUserRole } from '@/actions/admin/users';
import { ROLES } from '@/config/roles';

interface Props {
  userId: string;
  currentRole: string;
}

export function RoleSelect({ userId, currentRole }: Props) {
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
      await updateUserRole(userId, newRole);
    });
  };

  // Хак для кастомных ролей, которых пока нет в конфиге
  const options = { ...ROLES } as Record<string, string>;
  if (!options[currentRole]) {
    options[currentRole] = currentRole;
  }

  return (
    <select
      value={currentRole}
      onChange={handleChange}
      disabled={isPending}
      className={`bg-theme-bg border-2 rounded-[16px] px-3 py-2 font-bold outline-none anime-shadow transition-all text-sm appearance-none cursor-pointer disabled:opacity-50 min-w-[130px] ${
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
  );
}