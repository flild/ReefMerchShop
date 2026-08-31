import { db } from '@/db';
import { collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddParticipantForm } from '@/components/admin/collects/AddParticipantForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AddParticipantPage({ params }: PageProps) {
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
        <h1 className="text-4xl font-display font-extrabold">Ручное добавление участника</h1>
        <p className="text-theme-muted font-bold text-lg">
          Коллект: <span className="text-theme-text">{collect.title}</span>
        </p>
      </header>

      {/* Передаем только ID коллекта, остальное менеджер вобьет руками */}
      <AddParticipantForm collectId={id} />
    </div>
  );
}