'use client';

import { useActionState } from 'react';
import { createTemplate } from '@/actions/admin/templates';
import Link from 'next/link';

const AVAILABLE_FORMATS = ['PSD', 'AI', 'CDR', 'PDF', 'PNG', 'SVG'];

export function TemplateForm() {
  const [state, formAction, isPending] = useActionState(createTemplate, null);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Название</label>
        <input 
          type="text" 
          name="title" 
          required
          placeholder="Например: Брелок 50х50"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Тип изделия</label>
          <input 
            type="text" 
            name="productType" 
            placeholder="acrylic_keychain"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Размер</label>
          <input 
            type="text" 
            name="size" 
            placeholder="50x50 мм"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание / Инструкция</label>
        <textarea 
          name="description" 
          rows={3}
          placeholder="Внутри архива лежат макеты с вылетами..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="font-extrabold text-theme-text ml-2">Доступные форматы</label>
        <div className="flex flex-wrap gap-3">
          {AVAILABLE_FORMATS.map((fmt) => (
            <label 
              key={fmt} 
              className="relative cursor-pointer"
            >
              <input 
                type="checkbox" 
                name="formats" 
                value={fmt}
                className="peer sr-only"
              />
              <div className="px-5 py-2 bg-theme-bg border-2 border-theme-border rounded-[16px] font-bold text-theme-muted peer-checked:bg-theme-highlight peer-checked:text-theme-bg peer-checked:border-theme-highlight transition-all anime-shadow hover:-translate-y-0.5">
                {fmt}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Загрузка...' : 'Добавить шаблон'}
        </button>
        <Link 
          href="/admin/content"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}