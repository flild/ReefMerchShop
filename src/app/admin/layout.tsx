import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from '@/lib/auth';
import { AdminLayoutClient } from '@/components/admin/layout/AdminLayoutClient';

export const dynamic = 'force-dynamic';

const roleDisplayNames: Record<string, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  maker: 'Дизайнер макетов',
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session || !['admin', 'manager', 'maker'].includes(session.role)) {
    redirect('/login');
  }

  const logoutAction = async () => {
    'use server';
    await deleteSession();
    redirect('/login');
  };

  return (
    <AdminLayoutClient
      userRole={session.role}
      roleDisplayName={roleDisplayNames[session.role] || session.role}
      logoutAction={logoutAction}
    >
      {children}
    </AdminLayoutClient>
  );
}
