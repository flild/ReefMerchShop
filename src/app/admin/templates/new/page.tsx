import { TemplateForm } from '@/components/admin/content/TemplateForm';

export const dynamic = 'force-dynamic';

export default function NewTemplatePage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новый шаблон</h1>
        <p className="text-theme-muted font-bold text-lg">
          Загрузи заготовку, чтобы художники не мучали менеджеров.
        </p>
      </header>

      <TemplateForm />
    </div>
  );
}