'use client';

import { useActionState } from 'react';
import { createCollect } from '@/actions/admin/collects';
import Link from 'next/link';

export function CollectForm() {
  const [state, formAction, isPending] = useActionState(createCollect, null);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Название коллекта</label>
        <input 
          type="text" 
          name="title" 
          required
          placeholder="СЕНТЯБРЬСКИЙ КОЛЛЕКТ НА АКРИЛ"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание / Условия</label>
        <textarea 
          name="description" 
          required
          rows={3}
          placeholder="Скидка 10% от 50 штук..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Дедлайн приема (до)</label>
          <input 
            type="datetime-local" 
            name="deadline" 
            required
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all appearance-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Сроки производства</label>
          <input 
            type="text" 
            name="productionDate" 
            required
            placeholder="20–25 сентября"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Минимальное количество (шт)</label>
        <input 
          type="number" 
          name="minCount" 
          required
          min="1"
          defaultValue="100"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all w-1/2"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Создаем...' : 'Запустить коллект'}
        </button>
        <Link 
          href="/admin/collects"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}