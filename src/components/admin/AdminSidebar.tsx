'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Image as ImageIcon, 
  Users, 
  Boxes,
  Settings,
  LucideIcon
} from 'lucide-react';
import { cn } from '../../../lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  allowedRoles: string[];
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Дашборд', icon: LayoutDashboard, allowedRoles: ['admin', 'manager', 'maker'] },
  { href: '/admin/orders', label: 'Заказы', icon: ShoppingCart, allowedRoles: ['admin', 'manager', 'maker'] },
  { href: '/admin/inventory', label: 'Склад', icon: Package, allowedRoles: ['admin', 'manager', 'maker'] },
  { href: '/admin/collects', label: 'Коллекты', icon: Boxes, allowedRoles: ['admin', 'manager', 'maker'] },
  { href: '/admin/portfolio', label: 'Портфолио', icon: ImageIcon, allowedRoles: ['admin', 'manager'] },
  { href: '/admin/content', label: 'Контент', icon: Settings, allowedRoles: ['admin', 'manager'] },
  { href: '/admin/users', label: 'Пользователи', icon: Users, allowedRoles: ['admin', 'manager'] },
];

interface AdminSidebarProps {
  userRole: string;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) => 
    item.allowedRoles.includes(userRole)
  );

  return (
    <aside className="w-72 flex-shrink-0 h-screen sticky top-0 bg-theme-surface border-r-2 border-theme-border flex flex-col p-6 overflow-y-auto">
      <div className="mb-8 px-2">
        <Link href="/admin" className="block">
          <h2 className="text-3xl font-display font-extrabold text-theme-text tracking-tight">
            REEF <span className="text-theme-highlight">ADMIN</span>
          </h2>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-5 py-3.5 rounded-full font-bold transition-all border-2",
                isActive 
                  ? "anime-button border-transparent" 
                  : "text-theme-muted border-transparent hover:border-theme-border hover:text-theme-text hover:bg-theme-bg"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t-2 border-theme-border">
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors border-2 border-transparent hover:border-theme-border"
        >
          ← На сайт
        </Link>
      </div>
    </aside>
  );
}