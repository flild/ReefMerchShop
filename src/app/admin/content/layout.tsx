import type { ReactNode } from 'react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function ContentLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session || !['admin', 'manager'].includes(session.role)) redirect('/admin/orders');
  return children;
}
