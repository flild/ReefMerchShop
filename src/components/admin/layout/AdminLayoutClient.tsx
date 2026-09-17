'use client';

import { ReactNode, useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface AdminLayoutClientProps {
  children: ReactNode;
  userRole: string;
  roleDisplayName: string;
  logoutAction: () => Promise<void>;
}

export function AdminLayoutClient({ children, userRole, roleDisplayName, logoutAction }: AdminLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on navigation
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text flex relative">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 lg:static lg:block h-full`}>
        <AdminSidebar userRole={userRole} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 md:h-20 bg-theme-surface border-b-2 border-theme-border px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 hover:bg-theme-bg rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} className="text-theme-text" />
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-theme-muted uppercase tracking-wider">Рабочее пространство</span>
              <p className="text-sm font-extrabold text-theme-text">Панель управления типографией</p>
            </div>
            <div className="sm:hidden text-lg font-display font-extrabold text-theme-text tracking-tight">
              REEF <span className="text-theme-highlight">ADMIN</span>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-theme-muted uppercase">Роль</span>
              <span className="text-sm font-extrabold text-theme-text">
                {roleDisplayName}
              </span>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="anime-button px-3 md:px-4 py-2 text-xs bg-theme-bg border-2 border-theme-border text-theme-text cursor-pointer whitespace-nowrap"
              >
                Выйти
              </button>
            </form>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
