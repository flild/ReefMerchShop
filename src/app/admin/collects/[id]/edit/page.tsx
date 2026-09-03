import { db } from '@/db';
import { collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { CollectForm } from '@/components/admin/collects/CollectForm';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCollectPage({ params }: PageProps) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    redirect('/admin/collects');
  }

  const { id } = await params;

  const collectResult = await db
    .select()
    .from(collects)
    .where(eq(collects.id, id))
    .limit(1);

  if (!collectResult.length) {
    notFound();
  }

  const collect = collectResult[0];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <Link 
          href={`/admin/collects/${id}`}
          className="w-fit mb-2 text-theme-muted hover:text-theme-highlight transition-colors font-bold flex items-center gap-2"
        >
          ← Вернуться к коллекту
        </Link>
        <h1 className="text-4xl font-display font-extrabold mb-2 text-theme-text">Редактирование</h1>
        <p className="text-theme-muted font-bold text-lg">
          Коллект: <span className="text-theme-text">{collect.title}</span>
        </p>
      </header>

      <CollectForm 
        initialData={{
          id: collect.id,
          title: collect.title,
          description: collect.description,
          deadline: collect.deadline,
          productionDate: collect.productionDate,
          minCount: collect.minCount,
          targetSumLimit: collect.targetSumLimit,
          driveLink: collect.driveLink,
        }} 
      />
    </div>
  );
}