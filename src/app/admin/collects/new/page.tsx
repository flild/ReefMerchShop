import { CollectForm } from '@/components/admin/collects/CollectForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewCollectPage() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    redirect('/admin/collects');
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2 text-theme-text">Новый коллект</h1>
        <p className="text-theme-muted font-bold text-lg">
          Запусти совместную закупку для художников.
        </p>
      </header>

      <CollectForm />
    </div>
  );
}