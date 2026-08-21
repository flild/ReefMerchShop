import { db } from '@/db';
import { categories } from '@/db/schema';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { DeleteCategoryButton } from '@/components/admin/categories/DeleteCategoryButton';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage() {
  const items = await db.select().from(categories);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Категории</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление разделами для портфолио и материалов
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/portfolio" className="px-6 py-3 text-lg font-bold text-theme-muted hover:text-theme-text transition-colors flex items-center">
            ← Назад в портфолио
          </Link>
          <Link href="/admin/portfolio/categories/new" className="anime-button px-6 py-3 text-lg block">
            + Создать категорию
          </Link>
        </div>
      </header>

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-theme-border bg-theme-bg">
              <th className="p-5 font-extrabold text-theme-text w-1/4">Название</th>
              <th className="p-5 font-extrabold text-theme-text w-1/4">Slug</th>
              <th className="p-5 font-extrabold text-theme-text">Описание</th>
              <th className="p-5 font-extrabold text-theme-text w-32 text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="border-b-2 border-theme-border last:border-0 hover:bg-theme-bg/50 transition-colors"
              >
                <td className="p-5 font-bold text-theme-text text-lg">{item.name}</td>
                <td className="p-5 text-theme-muted font-bold text-sm">{item.slug}</td>
                <td className="p-5 text-sm font-medium text-theme-text max-w-xs truncate">
                  {item.description || '—'}
                </td>
                <td className="p-5 flex justify-end gap-2">
                  <Link
                    href={`/admin/portfolio/categories/${item.id}/edit`}
                    className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all"
                    title="Редактировать"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <DeleteCategoryButton id={item.id} />
                </td>
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <p className="text-theme-muted font-bold text-xl">Категорий пока нет.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}