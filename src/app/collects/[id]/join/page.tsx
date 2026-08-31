import { db } from '@/db';
import { collects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { JoinCollectForm } from '@/components/collects/JoinCollectForm';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JoinCollectPage({ params }: PageProps) {
  const { id } = await params;

  // Тянем только те поля, которые реально нужны клиенту (паттерн Data Transfer Object)
  const collectResult = await db
    .select({
      id: collects.id,
      title: collects.title,
      driveLink: collects.driveLink,
      status: collects.status,
    })
    .from(collects)
    .where(eq(collects.id, id))
    .limit(1);

  if (!collectResult.length) {
    notFound();
  }

  const collect = collectResult[0];

  if (collect.status !== 'open') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-theme-bg">
        <div className="bg-theme-surface anime-border anime-shadow p-12 text-center rounded-[40px]">
          <h1 className="text-3xl font-display font-black text-theme-text mb-4">Набор закрыт 🛑</h1>
          <p className="text-theme-muted font-bold">К сожалению, в этот коллект больше нельзя записаться.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg manga-dots py-24 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <JoinCollectForm 
          collectId={collect.id} 
          title={collect.title} 
          driveLink={collect.driveLink} 
        />
      </div>
    </main>
  );
}