import { db } from '@/db';
import { accessories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { AccessoryForm } from '@/components/admin/inventory/AccessoryForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function EditAccessoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [accessory] = await db
    .select()
    .from(accessories)
    .where(eq(accessories.id, id));

  if (!accessory) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/inventory?tab=accessories" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование фурнитуры</h1>
          <p className="text-theme-muted font-bold text-lg">
            Поменяй цену, название или остатки.
          </p>
        </div>
      </header>

      <AccessoryForm initialData={accessory} />
    </div>
  );
}