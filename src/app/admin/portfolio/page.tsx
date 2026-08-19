import { db } from '@/db';
import { portfolioItems, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { DeletePortfolioButton } from '@/components/admin/portfolio/DeletePortfolioButton';
import { Pencil } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortfolioAdminPage() {
  const items = await db
    .select({
      id: portfolioItems.id,
      title: portfolioItems.title,
      imageUrl: portfolioItems.imageUrl,
      authorName: portfolioItems.authorName,
      categoryName: categories.name,
    })
    .from(portfolioItems)
    .leftJoin(categories, eq(portfolioItems.categoryId, categories.id))
    .orderBy(desc(portfolioItems.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Портфолио</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление галереей готовых работ
          </p>
        </div>
        <Link href="/admin/portfolio/new" className="anime-button px-6 py-3 text-lg block">
          + Загрузить работу
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <article 
            key={item.id} 
            className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden flex flex-col group"
          >
            {/* Блок с картинкой. Жестко задаем пропорции */}
            <div className="relative w-full aspect-square border-b-2 border-theme-border bg-theme-bg overflow-hidden">
              {/* Заглушка, если нет картинки, или рендер через Image/img. 
                  Предполагаем, что imageUrl содержит валидный путь (S3 или /uploads/) */}
              {item.imageUrl ? (
                <Image 
                  src={item.imageUrl} 
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized // Убираем оптимизацию для внешних S3/фикстур без настроек
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-theme-muted font-bold">
                  Нет фото
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col gap-2 relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-theme-text line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-theme-muted font-bold text-sm mt-1">
                    {item.categoryName || 'Без категории'}
                  </div>
                </div>
                
                {/* Кнопка удаления */}
                <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-extrabold text-theme-text line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="text-theme-muted font-bold text-sm mt-1">
                    {item.categoryName || 'Без категории'}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/portfolio/${item.id}/edit`}
                    className="p-2 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all"
                    title="Редактировать"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <DeletePortfolioButton id={item.id} />
                </div>
              </div>
              </div>

              {item.authorName && (
                <div className="mt-2 inline-flex self-start items-center px-3 py-1 bg-theme-bg border-2 border-theme-border rounded-full text-sm font-bold text-theme-text">
                  Автор: {item.authorName}
                </div>
              )}
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-20 text-center bg-theme-surface anime-border rounded-[40px]">
            <p className="text-theme-muted font-bold text-xl">Галерея пуста.</p>
          </div>
        )}
      </div>
    </div>
  );
}