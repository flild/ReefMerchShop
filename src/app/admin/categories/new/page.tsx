import { CategoryForm } from '@/components/admin/categories/CategoryForm';

export const dynamic = 'force-dynamic';

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новая категория</h1>
        <p className="text-theme-muted font-bold text-lg">
          Добавьте раздел для группировки работ.
        </p>
      </header>

      <CategoryForm />
    </div>
  );
}