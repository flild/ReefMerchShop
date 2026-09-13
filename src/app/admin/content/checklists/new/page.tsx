import { ChecklistTemplateForm } from '@/components/admin/content/checklists/ChecklistTemplateForm';

export const dynamic = 'force-dynamic';

export default function NewChecklistTemplatePage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новый шаблон чек-листа</h1>
      </header>

      <ChecklistTemplateForm />
    </div>
  );
}
