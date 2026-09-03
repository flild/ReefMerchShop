// src/app/admin/collects/[id]/page.tsx
import { db } from '@/db';
import { collects, collectParticipants } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { CollectStatusBadge } from '@/components/admin/collects/CollectStatusBadge';
import { CollectStatusManager } from '@/components/admin/collects/CollectStatusManager';
import { calculateDiscount } from '@/lib/collects';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectDetailsAdminPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  const isMaker = session?.role === 'maker';

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
    .select()
    .from(collectParticipants)
    .where(eq(collectParticipants.collectId, id))
    .orderBy(desc(collectParticipants.createdAt));

  const progressSum = Math.min((collect.currentSum / collect.targetSumLimit) * 100, 100);
  const progressCount = Math.min((collect.currentCount / collect.minCount) * 100, 100);
  const currentDiscount = calculateDiscount(collect.currentSum);

  return (
    <div className="flex flex-col gap-8">
      {/* Шапка коллекта */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/collects"
            className="w-fit text-theme-muted hover:text-theme-highlight transition-colors font-bold flex items-center gap-2"
          >
            ← Ко всем коллектам
          </Link>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-4xl font-display font-extrabold text-theme-text">{collect.title}</h1>
            <CollectStatusBadge status={collect.status} />
          </div>
        </div>

        {/* Действия доступны только менеджерам и админам */}
        {!isMaker && (
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/collects/${collect.id}/edit`}
              className="anime-button px-5 py-2.5 text-sm bg-theme-surface text-theme-text border-2 border-theme-border"
            >
              Редактировать
            </Link>
            <Link
              href={`/admin/collects/${collect.id}/add`}
              className="anime-button px-5 py-2.5 text-sm"
            >
              + Добавить участника
            </Link>
          </div>
        )}
      </header>

      {/* Метрики и сводка */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-theme-surface anime-border p-5 flex flex-col gap-1">
          <span className="text-theme-muted font-bold text-xs uppercase">Дедлайн приема</span>
          <span className="text-2xl font-extrabold text-theme-text">
            {new Date(collect.deadline).toLocaleDateString('ru-RU')}
          </span>
        </div>

        <div className="bg-theme-surface anime-border p-5 flex flex-col gap-1">
          <span className="text-theme-muted font-bold text-xs uppercase">Отправка в тираж</span>
          <span className="text-2xl font-extrabold text-theme-text">{collect.productionDate}</span>
        </div>

        <div className="bg-theme-surface anime-border p-5 flex flex-col gap-1">
          <span className="text-theme-muted font-bold text-xs uppercase">Тираж (позиций)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-theme-text">{collect.currentCount}</span>
            <span className="text-theme-muted font-bold text-sm">/ {collect.minCount} шт.</span>
          </div>
          <div className="w-full bg-theme-bg h-2 rounded-full mt-2 overflow-hidden border border-theme-border">
            <div
              className="bg-theme-highlight h-full transition-all"
              style={{ width: `${progressCount}%` }}
            />
          </div>
        </div>

        {/* Финансовый блок виден только персоналу с доступом */}
        {!isMaker ? (
          <div className="bg-theme-surface anime-border p-5 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-theme-muted font-bold text-xs uppercase">Банк сбора</span>
              <span className="text-xs font-extrabold text-theme-highlight">Скидка {currentDiscount}%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-theme-text">
                {collect.currentSum.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-theme-muted font-bold text-sm">
                / {collect.targetSumLimit.toLocaleString('ru-RU')} ₽
              </span>
            </div>
            <div className="w-full bg-theme-bg h-2 rounded-full mt-2 overflow-hidden border border-theme-border">
              <div
                className="bg-theme-highlight h-full transition-all"
                style={{ width: `${progressSum}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="bg-theme-surface anime-border p-5 flex flex-col gap-1">
            <span className="text-theme-muted font-bold text-xs uppercase">Статус производства</span>
            <span className="text-xl font-extrabold text-theme-text">В обработке макетов</span>
            <span className="text-xs font-bold text-theme-muted mt-2">Финансовые показатели скрыты</span>
          </div>
        )}
      </div>

      {/* Описание и ссылка на исходники */}
      <section className="bg-theme-surface anime-border anime-shadow p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-theme-border pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-theme-text">Информация о тираже</h2>
            <p className="text-theme-muted font-bold text-sm mt-1">{collect.description || 'Нет описания'}</p>
          </div>
          {!isMaker && (
            <div className="flex items-center gap-3">
              <span className="text-theme-muted font-bold text-sm">Сменить статус:</span>
              <CollectStatusManager id={collect.id} currentStatus={collect.status} />
            </div>
          )}
        </div>

        {collect.driveLink && (
          <div className="flex items-center justify-between bg-theme-bg p-4 border-2 border-theme-border rounded-[24px]">
            <div className="flex flex-col">
              <span className="font-extrabold text-theme-text">Общий диск тиража</span>
              <span className="text-xs text-theme-muted font-bold">Папка для производственных файлов типографии</span>
            </div>
            <a
              href={collect.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="anime-button px-5 py-2 text-sm"
            >
              Открыть диск ↗
            </a>
          </div>
        )}
      </section>

      {/* Таблица участников */}
      <section className="bg-theme-surface anime-border anime-shadow p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-theme-text">
            Участники ({participants.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-xs uppercase font-extrabold">
                <th className="pb-3 px-3">Участник</th>
                <th className="pb-3 px-3">Контакты</th>
                <th className="pb-3 px-3">Макет</th>
                <th className="pb-3 px-3 text-center">Тираж</th>
                {!isMaker && <th className="pb-3 px-3 text-right">Сумма (₽)</th>}
                <th className="pb-3 px-3 text-center">Макеты сданы</th>
                <th className="pb-3 px-3 text-right">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-theme-border">
              {participants.map((item) => (
                <tr key={item.id} className="font-bold text-sm hover:bg-theme-bg/50 transition-colors">
                  <td className="py-4 px-3">
                    <div className="flex flex-col">
                      <span className="text-theme-text font-extrabold">{item.nickname}</span>
                      <span className="text-xs text-theme-muted">{item.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-col text-xs text-theme-muted gap-0.5">
                      {item.telegram && <span>TG: @{item.telegram.replace('@', '')}</span>}
                      {item.vkId && <span>VK: {item.vkId}</span>}
                      {!item.telegram && !item.vkId && <span>—</span>}
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex flex-col max-w-[220px]">
                      <span className="text-theme-text line-clamp-1">{item.layoutName || 'Без названия'}</span>
                      {item.layoutLink ? (
                        <a
                          href={item.layoutLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-theme-highlight hover:underline font-bold mt-0.5 inline-block"
                        >
                          Файлы макета ↗
                        </a>
                      ) : (
                        <span className="text-xs text-theme-muted">Ссылка не прикреплена</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center text-theme-text font-extrabold text-base">
                    {item.quantity} шт.
                  </td>
                  {!isMaker && (
                    <td className="py-4 px-3 text-right text-theme-text font-extrabold">
                      {item.totalPrice.toLocaleString('ru-RU')}
                    </td>
                  )}
                  <td className="py-4 px-3 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                        item.isLayoutsUploaded
                          ? 'bg-theme-green-bg text-theme-green-text'
                          : 'bg-theme-yellow-bg text-theme-yellow-text'
                      }`}
                    >
                      {item.isLayoutsUploaded ? 'Готовы' : 'Ждем файлы'}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-right">
                    <span className="inline-block px-3 py-1 bg-theme-bg border border-theme-border rounded-full text-xs font-extrabold text-theme-text">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}

              {participants.length === 0 && (
                <tr>
                  <td colSpan={isMaker ? 6 : 7} className="py-12 text-center text-theme-muted font-bold">
                    В этом коллекте еще нет участников.
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