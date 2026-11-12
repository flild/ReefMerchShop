import { assertStaffManager } from '@/lib/auth';
import { CreateArticleForm } from '@/components/admin/guides/CreateArticleForm';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  await assertStaffManager();
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новая статья</h1>
        <p className="text-theme-muted font-bold text-lg">
          Задай название, а текст напишешь в редакторе на следующем шаге.
        </p>
      </header>

      <CreateArticleForm />
    </div>
  );
}