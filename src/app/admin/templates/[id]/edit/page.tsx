import { db } from '@/db';
import { templates } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { TemplateForm } from '@/components/admin/templates/TemplateForm';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/admin');
  }

  const { id } = await params;

  const items = await db.select().from(templates).where(eq(templates.id, id)).limit(1);
  if (!items.length) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link
          href="/admin/templates"
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2 text-theme-text">Редактирование шаблона</h1>
          <p className="text-theme-muted font-bold text-lg">
            Изменение параметров шаблона
          </p>
        </div>
      </header>

      <TemplateForm initialData={items[0]} />
    </div>
  );
}
