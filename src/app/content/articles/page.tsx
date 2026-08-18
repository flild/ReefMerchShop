import { db } from '@/db';
import { articles } from '@/db/schema';
import { desc } from 'drizzle-orm';
import Link from 'next/link';
import { PublishToggle, DeleteArticleButton } from '@/components/admin/guides/ArticleActions';

export const dynamic = 'force-dynamic';

export default async function ArticlesAdminPage() {
  const articlesList = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Гайды и Статьи</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление контентом и скрытая статистика
          </p>
        </div>
        <Link href="/admin/content/articles/new" className="anime-button px-6 py-3 text-lg block">
          + Написать статью
        </Link>
      </header>

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">Статья</th>
                <th className="p-5 font-extrabold text-center">Просмотры / Дочитывания</th>
                <th className="p-5 font-extrabold text-center">Оценки (Да / Нет)</th>
                <th className="p-5 font-extrabold text-center">Статус</th>
                <th className="p-5 font-extrabold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {articlesList.map((article) => {
                const readRate = article.viewsCount > 0 
                  ? Math.round((article.readsCount / article.viewsCount) * 100) 
                  : 0;

                return (
                  <tr 
                    key={article.id} 
                    className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors group"
                  >
                    <td className="p-5">
                      <Link 
                        href={`/admin/content/articles/${article.id}`} 
                        className="font-extrabold text-theme-highlight hover:underline text-lg line-clamp-1"
                      >
                        {article.title}
                      </Link>
                      <div className="text-theme-muted text-sm font-bold mt-1">
                        /{article.slug}
                      </div>
                    </td>
                    
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-display font-extrabold text-theme-text text-xl">
                          {article.viewsCount} <span className="text-theme-muted text-sm font-sans">👁</span>
                        </span>
                        <div className="text-theme-muted font-bold text-xs mt-1 bg-theme-bg border border-theme-border px-2 py-0.5 rounded-md">
                          Дочитали: {readRate}%
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-3 font-extrabold">
                        <span className="text-theme-green-text bg-theme-green-bg px-3 py-1 rounded-full text-sm">
                          +{article.likesCount}
                        </span>
                        <span className="text-theme-yellow-text bg-theme-yellow-bg px-3 py-1 rounded-full text-sm">
                          -{article.dislikesCount}
                        </span>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <PublishToggle id={article.id} isPublished={article.isPublished} />
                    </td>

                    <td className="p-5">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/content/articles/${article.id}`}
                          className="px-4 py-2 bg-theme-bg border-2 border-theme-border rounded-[12px] font-bold text-sm hover:border-theme-highlight transition-all"
                        >
                          Редактор
                        </Link>
                        <DeleteArticleButton id={article.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {articlesList.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-theme-muted font-bold text-lg">
                    Статей пока нет. Заведи первую.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}