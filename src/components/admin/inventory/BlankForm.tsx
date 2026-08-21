'use client';

import { useActionState } from 'react';
import { createBlank } from '@/actions/admin/inventory';
import Link from 'next/link';

interface Material {
  id: string;
  name: string;
}

interface BlankFormProps {
  materials: Material[];
}

export function BlankForm({ materials }: BlankFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await createBlank(formData);
    },
    null
  );

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Название заготовки</label>
        <input 
          type="text" 
          name="name" 
          required
          placeholder="Например: Основа под брелок"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Исходный материал (Форматник)</label>
          <select 
            name="materialId" 
            required
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none cursor-pointer"
          >
            <option value="">Выбери материал</option>
            {materials.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Размер (Опционально)</label>
          <input 
            type="text" 
            name="size" 
            placeholder="Например: 50x50 мм"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Начальный остаток (шт)</label>
          <input 
            type="number" 
            name="stock" 
            defaultValue="0"
            min="0"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Мин. остаток (алерт)</label>
          <input 
            type="number" 
            name="minStock" 
            defaultValue="50"
            min="0"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Создаем...' : 'Сохранить заготовку'}
        </button>
        <Link 
          href="/admin/inventory?tab=blanks"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}