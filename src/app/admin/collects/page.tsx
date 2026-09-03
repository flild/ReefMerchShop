import { db } from '@/db';
import { collects } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { CollectStatusBadge } from '@/components/admin/collects/CollectStatusBadge';
import { CollectStatusManager } from '@/components/admin/collects/CollectStatusManager';
import { calculateDiscount } from '@/lib/collects';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function CollectsAdminPage() {
  const session = await getSession();
  const isMaker = session?.role === 'maker';

  const items = await db
    .select()
    .from(collects)
    .orderBy(desc(collects.deadline));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2 text-theme-text">Коллекты</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление совместными заказами
          </p>
        </div>
        {!isMaker && (
          <Link href="/admin/collects/new" className="anime-button px-6 py-3 text-lg block">
            + Создать коллект
          </Link>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((collect) => {
          const isExpired = collect.deadline < new Date();
          const progressSum = Math.min((collect.currentSum / collect.targetSumLimit) * 100, 100);
          const progressCount = Math.min((collect.currentCount / collect.minCount) * 100, 100);
          const currentDiscount = calculateDiscount(collect.currentSum);

          return (
            <article 
              key={collect.id} 
              className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-6 flex flex-col gap-4 relative overflow-hidden"
            >
              {/* Прогресс-бар: для менеджеров по кассе, для макетчицы — по тиражу */}
              <div 
                className="absolute bottom-0 left-0 h-2 bg-theme-highlight transition-all"
                style={{ width: `${isMaker ? progressCount : progressSum}%` }}
              />

              <div className="flex items-start justify-between gap-4">
                <h3 className="text-2xl font-extrabold text-theme-text line-clamp-1 flex-1">
                  {collect.title}
                </h3>
                <CollectStatusBadge status={collect.status} />
              </div>

              {!isMaker && (
                <div className="flex items-center justify-between bg-theme-bg p-3 border-2 border-theme-border rounded-[20px]">
                  <span className="text-theme-muted font-bold text-sm">Управление:</span>
                  <CollectStatusManager id={collect.id} currentStatus={collect.status} />
                </div>
              )}

              <p className="text-theme-muted font-bold text-sm line-clamp-2">
                {collect.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col p-3 bg-theme-bg border-2 border-theme-border rounded-[20px]">
                  <span className="text-theme-muted font-bold text-xs uppercase">Дедлайн</span>
                  <span className={`font-extrabold ${isExpired ? 'text-theme-yellow-text' : 'text-theme-text'}`}>
                    {new Date(collect.deadline).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="flex flex-col p-3 bg-theme-bg border-2 border-theme-border rounded-[20px]">
                  <span className="text-theme-muted font-bold text-xs uppercase">Производство</span>
                  <span className="font-extrabold text-theme-text line-clamp-1">
                    {collect.productionDate}
                  </span>
                </div>
              </div>

              {/* Финансовый блок отрезается от макетчицы */}
              {!isMaker && (
                <div className="flex items-center justify-between p-3 bg-theme-bg border-2 border-theme-border rounded-[20px]">
                  <div className="flex flex-col">
                    <span className="text-theme-muted font-bold text-xs uppercase">Собрано (₽)</span>
                    <span className="font-extrabold text-theme-text">
                      {collect.currentSum.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-theme-muted font-bold text-xs uppercase">Скидка</span>
                    <span className="font-extrabold text-theme-highlight">
                      {currentDiscount}%
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-4 border-t-2 border-theme-border">
                <div className="flex flex-col">
                  <span className="text-theme-muted font-bold text-xs uppercase">Позиций</span>
                  <span className="font-extrabold text-theme-text text-xl">
                    {collect.currentCount} / {collect.minCount}
                  </span>
                </div>
                <Link 
                  href={`/admin/collects/${collect.id}`}
                  className="anime-button px-5 py-2 text-sm"
                >
                  Детали →
                </Link>
              </div>
            </article>
          );
        })}

        {items.length === 0 && (
          <div className="col-span-full py-20 text-center bg-theme-surface anime-border rounded-[40px]">
            <p className="text-theme-muted font-bold text-xl">Нет активных коллектов.</p>
          </div>
        )}
      </div>
    </div>
  );
}