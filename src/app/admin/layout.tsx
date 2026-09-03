import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

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

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex">
      {/* Боковой сайдбар с разграничением пунктов */}
      <AdminSidebar userRole={session.role} />

      {/* Основная рабочая зона */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-theme-surface border-b-2 border-theme-border px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">Рабочее пространство</span>
            <p className="text-sm font-extrabold text-theme-text">Панель управления типографией</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-theme-muted uppercase">Роль</span>
              <span className="text-sm font-extrabold text-theme-text">
                {roleDisplayNames[session.role] || session.role}
              </span>
            </div>

            <form
              action={async () => {
                'use server';
                await deleteSession();
                redirect('/login');
              }}
            >
              <button
                type="submit"
                className="anime-button px-4 py-2 text-xs bg-theme-bg border-2 border-theme-border text-theme-text cursor-pointer"
              >
                Выйти
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}