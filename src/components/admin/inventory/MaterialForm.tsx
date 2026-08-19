'use client';

import { useActionState } from 'react';
import { createMaterial, updateMaterial } from '@/actions/admin/inventory';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface MaterialData {
  id: string;
  name: string;
  type: string;
  categoryId: string | null;
  pricePerCm2: number;
  minStock: number;
  stock: number;
}

interface MaterialFormProps {
  categories: Category[];
  initialData?: MaterialData;
}

export function MaterialForm({ categories, initialData }: MaterialFormProps) {
  const isEditing = !!initialData?.id;

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (isEditing) {
        return await updateMaterial(initialData.id, formData);
      }
      return await createMaterial(formData);
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
        <label className="font-extrabold text-theme-text ml-2">Название материала</label>
        <input 
          type="text" 
          name="name" 
          required
          defaultValue={initialData?.name || ''}
          placeholder="Например: Прозрачный 3мм"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Тип</label>
          <select 
            name="type" 
            required
            defaultValue={initialData?.type || 'acrylic'}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none cursor-pointer"
          >
            <option value="acrylic">Акрил</option>
            <option value="holography">Голография</option>
            <option value="wood">Дерево</option>
            {/* Добавь сюда новые типы, если понадобятся */}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Категория</label>
          <select 
            name="categoryId"
            defaultValue={initialData?.categoryId || ''}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none cursor-pointer"
          >
            <option value="">Без категории</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Цена (₽/см²)</label>
          <input 
            type="number" 
            name="pricePerCm2" 
            step="0.1"
            min="0"
            defaultValue={initialData?.pricePerCm2 ?? 0}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Остаток</label>
          <input 
            type="number" 
            name="stock" 
            min="0"
            defaultValue={initialData?.stock ?? 0}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Мин. остаток</label>
          <input 
            type="number" 
            name="minStock" 
            min="0"
            defaultValue={initialData?.minStock ?? 1000}
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
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить' : 'Сохранить')}
        </button>
        <Link 
          href="/admin/inventory"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}