import { MaterialCategoryForm } from '@/components/admin/inventory/MaterialCategoryForm';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Новая категория материалов | Reef Admin',
};

export default async function NewMaterialCategoryPage() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    redirect('/login');
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-display font-black text-theme-text">Создание категории материалов</h1>
      </div>
      <MaterialCategoryForm />
    </div>
  );
}
