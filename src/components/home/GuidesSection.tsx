import Link from 'next/link';
import Image from 'next/image';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  badge: 'new' | 'popular';
}

interface GuidesSectionProps {
  items: ArticleItem[];
}

export function GuidesSection({ items }: GuidesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold text-theme-text mb-2">
            База знаний
          </h2>
          <p className="text-theme-muted font-bold text-lg">
            Полезные гайды по подготовке макетов и выбору материалов
          </p>
        </div>
        <Link 
          href="/guides"
          className="anime-button px-6 py-3 text-sm shrink-0"
        >
          Все статьи →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((article) => (
          <Link 
            key={article.id} 
            href={`/guides/${article.slug}`}
            className="group bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover rounded-[40px] flex flex-col overflow-hidden transition-all relative"
          >
            {/* Бейдж статуса */}
            <div className="absolute top-4 left-4 z-10">
              {article.badge === 'new' ? (
                <span className="bg-theme-highlight text-theme-bg px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border-2 border-theme-bg anime-shadow">
                  Новое
                </span>
              ) : (
                <span className="bg-theme-green-bg text-theme-green-text px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border-2 border-theme-green-text anime-shadow">
                  Популярное
                </span>
              )}
            </div>

            {article.coverImage ? (
              <div className="relative w-full aspect-[4/3] border-b-2 border-theme-border bg-theme-bg overflow-hidden">
                <Image 
                  src={article.coverImage} 
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] border-b-2 border-theme-border bg-theme-bg flex items-center justify-center manga-dots">
                <span className="text-4xl font-display font-extrabold text-theme-border">REEF</span>
              </div>
            )}

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-extrabold text-theme-text line-clamp-3 group-hover:text-theme-highlight transition-colors">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}