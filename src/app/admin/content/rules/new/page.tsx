import { RuleForm } from '@/components/admin/content/RuleForm';

export const dynamic = 'force-dynamic';

export default function NewRulePage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новое правило</h1>
        <p className="text-theme-muted font-bold text-lg">
          Настрой параметры автоматической проверки макетов.
        </p>
      </header>

      <RuleForm />
    </div>
  );
}