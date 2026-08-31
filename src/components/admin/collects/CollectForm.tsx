'use client';

import { useActionState, useState } from 'react';
import { createCollect } from '@/actions/admin/collects';
import Link from 'next/link';

// Выносим логику дат из компонента
function getFormDefaults() {
  const now = new Date();
  
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const deadlineStr = `${nextMonth.getFullYear()}-${pad(nextMonth.getMonth() + 1)}-${pad(nextMonth.getDate())}T${pad(nextMonth.getHours())}:${pad(nextMonth.getMinutes())}`;

  const monthsAdjectives = ['ЯНВАРСКИЙ', 'ФЕВРАЛЬСКИЙ', 'МАРТОВСКИЙ', 'АПРЕЛЬСКИЙ', 'МАЙСКИЙ', 'ИЮНЬСКИЙ', 'ИЮЛЬСКИЙ', 'АВГУСТОВСКИЙ', 'СЕНТЯБРЬСКИЙ', 'ОКТЯБРЬСКИЙ', 'НОЯБРЬСКИЙ', 'ДЕКАБРЬСКИЙ'];
  const autoTitle = `${monthsAdjectives[nextMonth.getMonth()]} КОЛЛЕКТ НА АКРИЛ`;

  const prodEnd = new Date(nextMonth);
  prodEnd.setDate(prodEnd.getDate() + 15);
  const monthsGenitive = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const prodStr = `${nextMonth.getDate()} – ${prodEnd.getDate()} ${monthsGenitive[prodEnd.getMonth()]}`;

  return {
    title: autoTitle,
    deadline: deadlineStr,
    production: prodStr,
    description: 'Скидка 5% за каждые 50 000 ₽ общего банка.\nМаксимальная скидка: 20%.',
    targetSumLimit: 250000,
    maxDiscount: 20
  };
}

export function CollectForm() {
  const [state, formAction, isPending] = useActionState(createCollect, null);
  const [defaults] = useState(getFormDefaults);

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-3xl flex flex-col gap-10">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      {/* БЛОК 1: ОСНОВНАЯ ИНФОРМАЦИЯ */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-display font-extrabold text-theme-text border-b-2 border-theme-border pb-2">
          📝 Основная информация
        </h3>
        
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Название коллекта</label>
          <input 
            type="text" 
            name="title" 
            required
            defaultValue={defaults.title}
            suppressHydrationWarning
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Описание / Условия</label>
          <textarea 
            name="description" 
            required
            rows={3}
            defaultValue={defaults.description}
            suppressHydrationWarning
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2 flex items-center justify-between">
            Общая ссылка на Google Диск
            <span className="text-xs text-theme-muted font-bold">(Необязательно сейчас)</span>
          </label>
          <input 
            type="url" 
            name="driveLink" 
            placeholder="https://drive.google.com/drive/folders/..."
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
          />
        </div>
      </div>

      {/* БЛОК 2: СРОКИ */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-display font-extrabold text-theme-text border-b-2 border-theme-border pb-2">
          ⏳ Сроки
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Дедлайн приема (до)</label>
            <input 
              type="datetime-local" 
              name="deadline" 
              required
              defaultValue={defaults.deadline}
              suppressHydrationWarning
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all appearance-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Сроки производства</label>
            <input 
              type="text" 
              name="productionDate" 
              required
              defaultValue={defaults.production}
              suppressHydrationWarning
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
            />
          </div>
        </div>
      </div>

      {/* БЛОК 3: ЭКОНОМИКА */}
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-display font-extrabold text-theme-text border-b-2 border-theme-border pb-2">
          💰 Экономика и лимиты
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 text-sm">Мин. тираж (шт)</label>
            <input 
              type="number" 
              name="minCount" 
              required
              min="1"
              defaultValue="10"
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 text-sm">Лимит суммы (₽)</label>
            <input 
              type="number" 
              name="targetSumLimit" 
              required
              min="50000"
              defaultValue={defaults.targetSumLimit}
              suppressHydrationWarning
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-highlight outline-none focus:border-theme-text transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2 text-sm">Макс. скидка (%)</label>
            <input 
              type="number" 
              name="maxDiscount" 
              required
              min="0"
              max="100"
              defaultValue={defaults.maxDiscount}
              suppressHydrationWarning
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-4 text-lg disabled:opacity-50 w-full md:w-auto"
        >
          {isPending ? 'Запускаем...' : '🚀 Запустить коллект'}
        </button>
        <Link 
          href="/admin/collects"
          className="px-8 py-4 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors text-center"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}