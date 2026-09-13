import { getChecklistTemplates } from '@/actions/admin/checklists';
import Link from 'next/link';
import { DeleteChecklistTemplateButton } from '@/components/admin/content/checklists/DeleteChecklistTemplateButton';

export const dynamic = 'force-dynamic';

export default async function AdminChecklistsPage() {
  const templates = await getChecklistTemplates();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Шаблоны чек-листов</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление шаблонами для визуального конструктора чек-листов.
          </p>
        </div>
        <Link href="/admin/content/checklists/new" className="anime-button px-6 py-3 text-sm">
          + Создать шаблон
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <article key={tpl.id} className="bg-theme-surface border-2 border-theme-border rounded-[24px] p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-extrabold text-theme-text">{tpl.title}</h3>
                <div className="text-theme-muted font-bold text-sm mt-1">
                  Блоков: {tpl.blocks.length}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/content/checklists/${tpl.id}`} className="p-2 text-theme-highlight hover:bg-theme-highlight/10 rounded-xl transition-colors">
                  ✎
                </Link>
                <DeleteChecklistTemplateButton id={tpl.id} />
              </div>
            </div>

            <p className="text-theme-muted font-bold text-sm">
              {tpl.description || 'Описание отсутствует'}
            </p>
          </article>
        ))}

        {templates.length === 0 && (
          <div className="col-span-full py-12 text-center text-theme-muted font-bold">
            Шаблонов пока нет. Создайте первый шаблон.
          </div>
        )}
      </div>
    </div>
  );
}
