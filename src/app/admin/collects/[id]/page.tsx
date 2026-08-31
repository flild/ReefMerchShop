import { db } from '@/db';
import { collects, collectParticipants, users, files } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ParticipantStatusSelect } from '@/components/admin/collects/ParticipantStatusSelect';
import { CollectStatusBadge } from '@/components/admin/collects/CollectStatusBadge';
import { CollectStatusManager } from '@/components/admin/collects/CollectStatusManager';
import { calculateDiscount } from '../../../../lib/collects';
import { DeleteCollectButton } from '@/components/admin/collects/DeleteCollectButton';
import { ParticipantTableRow } from '@/components/admin/collects/ParticipantTableRow';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectDetailsPage({ params }: PageProps) {
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

  const participants = await db
    .select({
      id: collectParticipants.id,
      quantity: collectParticipants.quantity,
      totalPrice: collectParticipants.totalPrice,
      status: collectParticipants.status,
      isLayoutsUploaded: collectParticipants.isLayoutsUploaded, // <- Новое
      nickname: collectParticipants.nickname, // <- Новое
      vkId: collectParticipants.vkId,
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

  const totalQuantity = collect.currentCount;
  
  const calculatedSum = collect.currentSum;
  const currentDiscount = calculateDiscount(calculatedSum);
  const progress = Math.min(100, (collect.currentSum / collect.targetSumLimit) * 100);

  // TODO: Интегрировать Auth.js / Lucia Auth
  // Заглушка для проверки прав. Макетчице (maker) ставим false.
  const currentUserRole = 'admin'; // 'admin', 'manager', 'maker'
  const canViewFinances = currentUserRole === 'admin' || currentUserRole === 'manager';

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/collects" 
            className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
          >
            ← Назад
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-display font-extrabold">
                {collect.title}
              </h1>
              <CollectStatusBadge status={collect.status} />
            </div>
            <p className="text-theme-muted font-bold">
              Дедлайн: {new Date(collect.deadline).toLocaleString('ru-RU', { 
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {/* Панель управления статусом */}
        <div className="bg-theme-surface p-3 rounded-[24px] anime-border flex items-center gap-3">
          <span className="font-bold text-theme-muted text-sm">Управление:</span>
          <CollectStatusManager id={collect.id} currentStatus={collect.status} />
        </div>
        <div className="flex items-center gap-3">
        <Link 
          href={`/admin/collects/${collect.id}/edit`}
          className="anime-button px-5 py-2 text-sm"
        >
          Редактировать
        </Link>
        <DeleteCollectButton id={collect.id} title={collect.title} />
      </div>
      </header>

      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-theme-muted font-bold">Описание и условия</span>
            <p className="text-theme-text font-bold bg-theme-bg p-4 border-2 border-theme-border rounded-[24px] whitespace-pre-wrap">
              {collect.description}
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <span className="text-theme-muted font-bold">Общая папка макетов</span>
            {collect.driveLink ? (
              <a 
                href={collect.driveLink}
                target="_blank"
                rel="noreferrer"
                className="bg-theme-bg border-2 border-theme-border rounded-[24px] p-4 font-extrabold text-theme-highlight hover:bg-theme-highlight hover:text-theme-btn-text transition-colors flex items-center gap-2 w-fit anime-shadow"
              >
                📁 Открыть Google Диск
              </a>
            ) : (
              <div className="bg-theme-yellow-bg text-theme-yellow-text border-2 border-theme-yellow-text rounded-[24px] p-4 font-bold max-w-fit">
                Ссылка на Google Диск не указана
              </div>
            )}
          </div>
        </div>

        {/* Финансовый блок (скрыт для макетчицы) */}
        {canViewFinances ? (
          <div className="flex flex-col gap-4 bg-theme-bg p-6 border-2 border-theme-border rounded-[32px] relative overflow-hidden">
            <div 
              className="absolute bottom-0 left-0 h-3 bg-theme-highlight transition-all opacity-80"
              style={{ width: `${progress}%` }}
            />
            
            <div className="flex flex-col">
              <span className="text-theme-muted font-bold text-sm">Собрано позиций</span>
              <span className="text-3xl font-display font-extrabold text-theme-text">
                {totalQuantity} <span className="text-theme-muted text-xl">/ {collect.minCount} шт.</span>
              </span>
            </div>

            <div className="flex flex-col pt-4 border-t-2 border-theme-border/50">
              <span className="text-theme-muted font-bold text-sm mb-1">Сумма заказов</span>
              <span className="text-4xl font-display font-extrabold text-theme-text">
                {calculatedSum.toLocaleString('ru-RU')} ₽
              </span>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t-2 border-theme-border/50">
              <span className="font-extrabold text-theme-text">Текущая скидка:</span>
              <span className="font-extrabold text-2xl text-theme-highlight bg-theme-surface px-4 py-1 rounded-[16px] border-2 border-theme-border">
                {currentDiscount}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 bg-theme-bg p-6 border-2 border-theme-border rounded-[32px] items-center justify-center text-center">
            <span className="text-4xl">📦</span>
            <div className="flex flex-col">
              <span className="text-theme-muted font-bold text-sm">Собрано позиций</span>
              <span className="text-3xl font-display font-extrabold text-theme-text">
                {totalQuantity} <span className="text-theme-muted text-xl">/ {collect.minCount} шт.</span>
              </span>
            </div>
          </div>
        )}
      </section>

      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="p-6 border-b-2 border-theme-border bg-theme-bg/50 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-display font-extrabold">Участники ({participants.length})</h2>
          
          <Link 
            href={`/admin/collects/${collect.id}/add`} 
            className="anime-button px-6 py-2 text-sm text-center flex items-center justify-center"
          >
            + Добавить участника
          </Link>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">Художник</th>
                <th className="p-5 font-extrabold">Контакты</th>
                <th className="p-5 font-extrabold">Макет</th>
                <th className="p-5 font-extrabold text-center">Тираж</th>
                {canViewFinances && <th className="p-5 font-extrabold text-right">Сумма</th>}
                <th className="p-5 font-extrabold">Статус</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <ParticipantTableRow 
                  key={participant.id} 
                  participant={participant} 
                  collectId={collect.id} 
                  canViewFinances={canViewFinances} 
                />
              ))}

              {participants.length === 0 && (
                <tr>
                  <td colSpan={canViewFinances ? 6 : 5} className="p-12 text-center text-theme-muted font-bold text-lg">
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