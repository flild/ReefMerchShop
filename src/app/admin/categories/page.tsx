import { db } from '@/db';
import { categories } from '@/db/schema';
import Link from 'next/link';
import Image from 'next/image';
import { Pencil } from 'lucide-react';
import { DeleteCategoryButton } from '@/components/admin/categories/DeleteCategoryButton';

export const dynamic = 'force-dynamic';

export default async function CategoriesAdminPage() {
  // Вытаскиваем все категории из базы
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
          <Link href="/admin/categories/new" className="anime-button px-6 py-3 text-lg block">
            + Создать категорию
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <article 
            key={item.id} 
            className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden flex flex-col group"
          >
            <div className="relative w-full h-48 border-b-2 border-theme-border bg-theme-bg overflow-hidden">
              {item.coverImage ? (
                <Image 
                  src={item.coverImage} 
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-theme-muted font-bold">
                  Нет обложки
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-2 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-theme-text line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="text-theme-muted font-bold text-sm mt-1">
                    slug: {item.slug}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/categories/${item.id}/edit`}
                    className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all"
                    title="Редактировать"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <DeleteCategoryButton id={item.id} />
                </div>
              </div>

              {item.description && (
                <p className="mt-2 text-theme-text font-medium text-sm line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-20 text-center bg-theme-surface anime-border rounded-[40px]">
            <p className="text-theme-muted font-bold text-xl">Категорий пока нет.</p>
          </div>
        )}
      </div>
    </div>
  );
}