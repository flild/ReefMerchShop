// src/components/auth/LogoutButton.tsx
'use client';

import { useTransition } from 'react';
import { logout } from '@/actions/auth';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(() => logout())}
      disabled={isPending}
      className="flex items-center gap-3 p-4 w-full text-rose-500 font-bold rounded-2xl border-2 border-transparent hover:border-rose-100 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:-translate-y-1 transition-all disabled:opacity-50"
    >
      <LogOut size={20} strokeWidth={2.5} />
      {isPending ? 'Выходим...' : 'Выйти'}
    </button>
  );
}