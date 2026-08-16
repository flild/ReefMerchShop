import { db } from '@/db';
import { templates, checklistRules } from '@/db/schema'; 
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { DeleteTemplateButton } from '@/components/admin/content/DeleteTemplateButton';
import { RuleStatusToggle, DeleteRuleButton } from '@/components/admin/content/RuleActions';

export const dynamic = 'force-dynamic';

export default async function ContentAdminPage() {
  const templatesList = await db
    .select()
    .from(templates)
    .orderBy(desc(templates.updatedAt));

    const rulesList = await db
    .select()
    .from(checklistRules)
    .orderBy(desc(checklistRules.productType));
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

     {/* Секция Правил чеклиста */}
      <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-display font-extrabold text-theme-text">Правила проверки (Чеклист)</h2>
          <Link href="/admin/content/rules/new" className="anime-button px-6 py-3 text-sm block">
            + Добавить правило
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-4 font-extrabold">Тип изделия</th>
                <th className="p-4 font-extrabold">Параметр</th>
                <th className="p-4 font-extrabold">Ожидается</th>
                <th className="p-4 font-extrabold w-1/3">Сообщение об ошибке</th>
                <th className="p-4 font-extrabold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {rulesList.map((rule) => (
                <tr key={rule.id} className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors">
                  <td className="p-4 font-extrabold text-theme-text">{rule.productType}</td>
                  <td className="p-4 font-bold text-theme-text">{rule.parameter}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-theme-bg border border-theme-border rounded-md text-sm font-bold text-theme-highlight">
                      {rule.expectedValue}
                    </span>
                  </td>
                  <td className="p-4 text-theme-muted font-bold text-sm">{rule.warningMessage}</td>
                  <td className="p-4 flex items-center justify-end gap-3">
                    <RuleStatusToggle id={rule.id} isActive={rule.isActive} />
                    <DeleteRuleButton id={rule.id} />
                  </td>
                </tr>
              ))}
              
              {rulesList.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-theme-muted font-bold">
                    Правила не заданы. Добавь первое, чтобы чеклист заработал.
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