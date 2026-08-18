'use client';

import { useActionState } from 'react';
import { createArticle } from '@/actions/admin/articles';
import Link from 'next/link';

export function CreateArticleForm() {
  const [state, formAction, isPending] = useActionState(createArticle, null);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Название гайда</label>
        <input 
          type="text" 
          name="title" 
          required
          placeholder="Как правильно подготовить макет для брелока"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">URL (Slug) — опционально</label>
        <input 
          type="text" 
          name="slug" 
          placeholder="kak-podgotovit-maket (сгенерируется автоматически, если пусто)"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Создаем черновик...' : 'Создать статью'}
        </button>
        <Link 
          href="/admin/content/articles"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}