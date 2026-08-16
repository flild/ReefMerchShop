import { db } from '@/db';
import { templates } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { DeleteTemplateButton } from '@/components/admin/content/DeleteTemplateButton';

export const dynamic = 'force-dynamic';

export default async function ContentAdminPage() {
  const templatesList = await db
    .select()
    .from(templates)
    .orderBy(desc(templates.updatedAt));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Контент и Инструменты</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление шаблонами для скачивания и правилами проверок макетов
          </p>
        </div>
      </header>

      {/* Секция Шаблонов */}
      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-extrabold text-theme-text">Шаблоны (Заготовки)</h2>
          <Link href="/admin/content/templates/new" className="anime-button px-6 py-3 text-sm block">
            + Загрузить шаблон
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templatesList.map((tpl) => {
            let formats: string[] = [];
            try {
              formats = JSON.parse(tpl.formatsJson);
            } catch (e) {
              console.error('Ошибка парсинга форматов шаблона', e);
            }

            return (
              <article key={tpl.id} className="bg-theme-bg border-2 border-theme-border rounded-[24px] p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-theme-text">{tpl.title}</h3>
                    <div className="text-theme-muted font-bold text-sm mt-1">
                      Тип: {tpl.productType || '—'} | Размер: {tpl.size || '—'}
                    </div>
                  </div>
                  <DeleteTemplateButton id={tpl.id} />
                </div>
                
                <p className="text-theme-muted font-bold text-sm">
                  {tpl.description || 'Описание отсутствует'}
                </p>
                
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t-2 border-theme-border">
                  {formats.map((fmt) => (
                    <span 
                      key={fmt} 
                      className="px-3 py-1 bg-theme-surface border-2 border-theme-border rounded-[12px] text-xs font-extrabold text-theme-highlight"
                    >
                      {fmt}
                    </span>
                  ))}
                  {formats.length === 0 && (
                    <span className="text-theme-muted text-xs font-bold">Форматы не указаны</span>
                  )}
                </div>
              </article>
            );
          })}

          {templatesList.length === 0 && (
            <div className="col-span-full py-12 text-center text-theme-muted font-bold">
              Шаблонов пока нет. Хватит лениться, загрузи парочку.
            </div>
          )}
        </div>
      </section>

      {/* Заглушка под правила чеклиста */}
      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-extrabold text-theme-text">Правила проверки (Чеклист)</h2>
          <button className="anime-button px-6 py-3 text-sm opacity-50 cursor-not-allowed">
            + Добавить правило
          </button>
        </div>
        <div className="text-theme-muted font-bold text-center py-8 border-2 border-theme-border border-dashed rounded-[24px] bg-theme-bg">
          Список правил (checklistRules) реализуем на следующем этапе.
        </div>
      </section>
    </div>
  );
}