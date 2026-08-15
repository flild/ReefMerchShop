import { ReactNode } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Админ-панель',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-theme-bg text-theme-text font-sans selection:bg-theme-highlight selection:text-theme-bg">
      <AdminSidebar />
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-8 lg:p-12 overflow-y-auto manga-dots">
        {/* manga-dots добавит легкий скринтон на фон контентной части */}
        {children}
      </main>
    </div>
  );
}