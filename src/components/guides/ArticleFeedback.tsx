'use client';

import { useState, useTransition } from 'react';
import { rateArticle } from '@/actions/client/articles';

export function ArticleFeedback({ slug }: { slug: string }) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);

  const handleRate = (isLike: boolean) => {
    startTransition(async () => {
      await rateArticle(slug, isLike);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 text-center transition-all">
        <span className="text-2xl font-display font-extrabold text-theme-text">
          Принято. Спасибо за фидбек!
        </span>
      </div>
    );
  }

  return (
    <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col items-center gap-6">
      <span className="text-2xl font-display font-extrabold text-theme-text text-center">
        Статья была полезна?
      </span>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => handleRate(true)}
          disabled={isPending}
          className="px-8 py-3 rounded-full font-extrabold transition-all anime-shadow hover:anime-shadow-hover active:translate-y-1 bg-theme-green-bg text-theme-green-text border-2 border-theme-green-text disabled:opacity-50"
        >
          Да, спасибо
        </button>
        <button
          onClick={() => handleRate(false)}
          disabled={isPending}
          className="px-8 py-3 rounded-full font-extrabold transition-all anime-shadow hover:anime-shadow-hover active:translate-y-1 bg-theme-gray-bg text-theme-gray-text border-2 border-theme-gray-text disabled:opacity-50"
        >
          Нет, вода
        </button>
      </div>
    </div>
  );
}