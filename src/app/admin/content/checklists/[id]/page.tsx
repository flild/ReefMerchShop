import { getChecklistTemplate } from '@/actions/admin/checklists';
import { ChecklistTemplateForm } from '@/components/admin/content/checklists/ChecklistTemplateForm';
import { ChecklistBlocksManager } from '@/components/admin/content/checklists/ChecklistBlocksManager';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditChecklistTemplatePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const template = await getChecklistTemplate(params.id);

  if (!template) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование шаблона</h1>
      </header>

      <ChecklistTemplateForm initialData={template} />

      <hr className="border-theme-border" />

      <section>
        <h2 className="text-3xl font-display font-extrabold mb-6">Блоки конструктора</h2>
        <ChecklistBlocksManager templateId={template.id} initialBlocks={template.blocks} />
      </section>
    </div>
  );
}
