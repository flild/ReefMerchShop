'use client';

import { useActionState } from 'react';
import { createRule } from '@/actions/admin/checklist';
import Link from 'next/link';

export function RuleForm() {
  const [state, formAction, isPending] = useActionState(createRule, null);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Тип изделия (ID / Slug)</label>
          <input 
            type="text" 
            name="productType" 
            required
            placeholder="acrylic_keychain"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Параметр проверки</label>
          <input 
            type="text" 
            name="parameter" 
            required
            placeholder="color_profile"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Ожидаемое значение</label>
        <input 
          type="text" 
          name="expectedValue" 
          required
          placeholder="CMYK"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
        <span className="text-theme-muted text-xs font-bold ml-2">
          Если макет не соответствует этому значению, выведется ошибка.
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Текст ошибки (Warning Message)</label>
        <textarea 
          name="warningMessage" 
          required
          rows={3}
          placeholder="Переведите документ в цветовой профиль CMYK, иначе цвета при печати могут исказиться."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : 'Добавить правило'}
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