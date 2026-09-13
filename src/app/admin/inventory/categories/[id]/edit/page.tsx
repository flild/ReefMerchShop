import { db } from '@/db';
import { materialCategories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { MaterialCategoryForm } from '@/components/admin/inventory/MaterialCategoryForm';

export const metadata = {
  title: 'Редактирование категории | Reef Admin',
};

export default async function EditMaterialCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    redirect('/login');
  }

  const { id } = await params;

  const [category] = await db.select().from(materialCategories).where(eq(materialCategories.id, id));

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-display font-black text-theme-text">Редактирование категории</h1>
      </div>
      <MaterialCategoryForm initialData={category} />
    </div>
  );
}
