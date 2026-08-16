import { db } from '@/db';
import { collects, collectParticipants, users, files } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CollectStatusToggle } from '@/components/admin/collects/CollectStatusToggle';
import { ParticipantStatusSelect } from '@/components/admin/collects/ParticipantStatusSelect';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Получаем коллект
  const collectResult = await db
    .select()
    .from(collects)
    .where(eq(collects.id, id))
    .limit(1);

  if (!collectResult.length) {
    notFound();
  }
  const collect = collectResult[0];

  // 2. Получаем участников с их файлами
  const participants = await db
    .select({
      id: collectParticipants.id,
      quantity: collectParticipants.quantity,
      status: collectParticipants.status,
      createdAt: collectParticipants.createdAt,
      clientName: users.name,
      clientEmail: users.email,
      clientTelegram: users.telegramId,
      fileName: files.name,
      filePath: files.path,
    })
    .from(collectParticipants)
    .leftJoin(users, eq(collectParticipants.userId, users.id))
    .leftJoin(files, eq(collectParticipants.fileId, files.id))
    .where(eq(collectParticipants.collectId, id))
    .orderBy(desc(collectParticipants.createdAt));

  const totalQuantity = participants.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/collects" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-1">
            {collect.title}
          </h1>
          <p className="text-theme-muted font-bold">
            Дедлайн: {new Date(collect.deadline).toLocaleString('ru-RU')}
          </p>
        </div>
      </header>

      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
        <div className="flex flex-col gap-2 max-w-2xl">
          <span className="text-theme-muted font-bold">Описание</span>
          <p className="text-theme-text font-bold bg-theme-bg p-4 border-2 border-theme-border rounded-[24px]">
            {collect.description}
          </p>
        </div>

        <div className="flex flex-col gap-4 min-w-[200px]">
          <div className="flex flex-col">
            <span className="text-theme-muted font-bold text-sm">Собрано позиций</span>
            <span className="text-3xl font-display font-extrabold text-theme-text">
              {totalQuantity} <span className="text-theme-muted text-xl">/ {collect.minCount}</span>
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-theme-muted font-bold text-sm mb-1">Статус набора</span>
            <CollectStatusToggle id={collect.id} status={collect.status} />
          </div>
        </div>
      </section>

      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="p-6 border-b-2 border-theme-border bg-theme-bg/50">
          <h2 className="text-2xl font-display font-extrabold">Участники ({participants.length})</h2>
        </div>
        
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">Художник</th>
                <th className="p-5 font-extrabold">Контакты</th>
                <th className="p-5 font-extrabold">Макет</th>
                <th className="p-5 font-extrabold">Тираж</th>
                <th className="p-5 font-extrabold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr 
                  key={participant.id} 
                  className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors"
                >
                  <td className="p-5 font-extrabold text-theme-text text-lg">
                    {participant.clientName || 'Без имени'}
                  </td>
                  <td className="p-5">
                    <div className="text-theme-muted font-bold text-sm">{participant.clientEmail || '—'}</div>
                    {participant.clientTelegram && (
                      <div className="text-theme-highlight font-bold text-sm mt-1">TG: {participant.clientTelegram}</div>
                    )}
                  </td>
                  <td className="p-5">
                    {participant.filePath ? (
                      <a 
                        href={participant.filePath} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-theme-highlight hover:underline font-bold flex items-center gap-2"
                      >
                        ↓ {participant.fileName || 'Скачать макет'}
                      </a>
                    ) : (
                      <span className="text-theme-muted font-bold text-sm">Файл не прикреплен</span>
                    )}
                  </td>
                  <td className="p-5 font-extrabold text-theme-text text-xl">
                    {participant.quantity} шт.
                  </td>
                  <td className="p-5">
                    <ParticipantStatusSelect 
                      participantId={participant.id} 
                      currentStatus={participant.status}
                      collectId={collect.id}
                    />
                  </td>
                </tr>
              ))}
              
              {participants.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-theme-muted font-bold text-lg">
                    В этом коллекте пока нет участников.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}