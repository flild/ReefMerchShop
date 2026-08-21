import { db } from '@/db';
import { portfolioItems, categories } from '@/db/schema';
import { eq, desc } from 'drizzle-orm'; // like, or, and, sql больше не нужны
import Link from 'next/link';
import Image from 'next/image';
import { DeletePortfolioButton } from '@/components/admin/portfolio/DeletePortfolioButton';
import { Pencil, Search, X } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function PortfolioAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const currentCategory = params.category || '';

  // Забираем все категории для вывода вкладок
  const allCategories = await db.select().from(categories);

  // Для базы оставляем только фильтр по категории
  const whereClause = currentCategory 
    ? eq(portfolioItems.categoryId, currentCategory) 
    : undefined;

  // 1. Достаем работы из БД
  let items = await db
    .select({
      id: portfolioItems.id,
      title: portfolioItems.title,
      description: portfolioItems.description, // Обязательно достаем описание для поиска
      imageUrl: portfolioItems.imageUrl,
      authorName: portfolioItems.authorName,
      categoryName: categories.name,
    })
    .from(portfolioItems)
    .leftJoin(categories, eq(portfolioItems.categoryId, categories.id))
    .where(whereClause)
    .orderBy(desc(portfolioItems.createdAt));

  // 2. Фильтруем кириллицу средствами JavaScript
  if (q) {
    const normalizedQ = q.toLowerCase();
    const words = normalizedQ.split(/\s+/).filter(w => w.trim().length > 0);
    
    if (words.length > 0) {
      items = items.filter(item => {
        // Собираем все текстовые поля карточки в одну строку и опускаем регистр
        const searchableText = `
          ${item.title || ''} 
          ${item.authorName || ''} 
          ${item.description || ''}
        `.toLowerCase();
        
        // Проверяем, что КАЖДОЕ слово из запроса есть в нашей строке
        return words.every(word => searchableText.includes(word));
      });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Шапка */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Портфолио</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление галереей готовых работ
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/portfolio/categories" className="px-6 py-3 text-lg font-bold text-theme-muted hover:text-theme-text transition-colors flex items-center bg-theme-surface anime-border rounded-full">
            📁 Категории
          </Link>
          <Link href="/admin/portfolio/new" className="anime-button px-6 py-3 text-lg block">
            + Загрузить работу
          </Link>
        </div>
      </header>

      {/* Панель фильтров и поиска */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-theme-surface anime-border p-4 rounded-3xl anime-shadow">
        {/* Вкладки категорий */}
        <div className="flex flex-wrap gap-2">
          <Link 
            href={`/admin/portfolio${q ? `?q=${q}` : ''}`}
            className={`px-5 py-2 rounded-full font-bold text-sm transition-all border-2 ${
              !currentCategory 
                ? 'bg-theme-highlight text-theme-bg border-theme-highlight' 
                : 'bg-theme-bg border-theme-border text-theme-muted hover:border-theme-highlight hover:text-theme-text'
            }`}
          >
            Все виды
          </Link>
          {allCategories.map(cat => (
            <Link
              key={cat.id}
              href={`/admin/portfolio?category=${cat.id}${q ? `&q=${q}` : ''}`}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all border-2 ${
                currentCategory === cat.id 
                  ? 'bg-theme-highlight text-theme-bg border-theme-highlight' 
                  : 'bg-theme-bg border-theme-border text-theme-muted hover:border-theme-highlight hover:text-theme-text'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Строка поиска */}
        <form method="GET" action="/admin/portfolio" className="relative w-full lg:w-72 shrink-0">
          {currentCategory && <input type="hidden" name="category" value={currentCategory} />}
          <input 
            type="text" 
            name="q"
            defaultValue={q}
            placeholder="Поиск по названию..."
            className="w-full bg-theme-bg border-2 border-theme-border rounded-full pl-10 pr-10 py-2.5 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all text-sm"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          {q && (
            <Link 
              href={`/admin/portfolio${currentCategory ? `?category=${currentCategory}` : ''}`} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-text"
              title="Сбросить поиск"
            >
              <X className="w-5 h-5" />
            </Link>
          )}
        </form>
      </div>

      {/* Сетка работ (компактная) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {items.map((item) => (
          <article 
            key={item.id} 
            className="bg-theme-surface anime-border border-2 anime-shadow rounded-[24px] overflow-hidden flex flex-col group transition-transform hover:-translate-y-1"
          >
            <div className="relative w-full aspect-square border-b-2 border-theme-border bg-theme-bg overflow-hidden">
              {item.imageUrl ? (
                <Image 
                  src={item.imageUrl} 
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized 
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-theme-muted font-bold text-sm">
                  Нет фото
                </div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3 relative grow">
              <div>
                <h3 className="text-lg font-extrabold text-theme-text line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <div className="text-theme-muted font-bold text-xs mt-1 truncate">
                  {item.categoryName || 'Без категории'}
                </div>
              </div>

              <div className="mt-auto pt-2 flex items-center justify-between gap-2 border-t-2 border-theme-border/50">
                {item.authorName ? (
                  <span className="text-xs font-bold text-theme-text truncate max-w-[100px]">
                    © {item.authorName}
                  </span>
                ) : (
                  <span />
                )}
                
                <div className="flex items-center gap-1 shrink-0">
                  <Link
                    href={`/admin/portfolio/${item.id}/edit`}
                    className="p-1.5 bg-theme-bg border-2 border-theme-border rounded-full text-theme-muted hover:text-theme-highlight hover:border-theme-highlight transition-all"
                    title="Редактировать"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  {/* У DeletePortfolioButton внутри свои отступы и иконка w-5 h-5, если хочешь сделать ее тоже мелкой — зайди в сам компонент и поставь w-4 h-4 и p-1.5 */}
                  <div className="scale-90 origin-right">
                    <DeletePortfolioButton id={item.id} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="col-span-full py-16 text-center bg-theme-surface anime-border rounded-[32px] anime-shadow">
            <p className="text-theme-muted font-bold text-xl">Ничего не найдено.</p>
          </div>
        )}
      </div>
    </div>
  );
}