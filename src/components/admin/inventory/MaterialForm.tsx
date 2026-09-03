// src/components/admin/inventory/MaterialForm.tsx
'use client';

import { useActionState } from 'react';
import { createMaterial, updateMaterial } from '@/actions/admin/inventory';
import Link from 'next/link';

export interface CategoryOption {
  id: string;
  name: string;
}

export interface MaterialTypeOption {
  id: string;
  name: string;
  slug: string;
}

export interface MaterialFormData {
  id: string;
  name: string;
  typeId: string;
  categoryId: string | null;
  description: string | null;
  imageUrl: string | null;
  pricePerCm2: number;
  minStock: number;
  stock: number;
}

interface MaterialFormProps {
  categories: CategoryOption[];
  types: MaterialTypeOption[];
  initialData?: MaterialFormData;
}

interface FormState {
  error?: string;
  success?: boolean;
}

export function MaterialForm({ categories, types, initialData }: MaterialFormProps) {
  const isEditing = Boolean(initialData?.id);

  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    async (_prevState: FormState | null, formData: FormData) => {
      if (isEditing && initialData) {
        return await updateMaterial(initialData.id, formData);
      }
      return await createMaterial(formData);
    },
    null
  );

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-3xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-2xl font-extrabold border-2 border-theme-border">
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
          placeholder="Например: Прозрачный акрил 3мм"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Тип материала (Справочник)</label>
          <select 
            name="typeId" 
            required
            defaultValue={initialData?.typeId || ''}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none cursor-pointer"
          >
            <option value="">Выберите тип...</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.slug})</option>
            ))}
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
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Цена (₽/см²)</label>
          <input 
            type="number" 
            name="pricePerCm2" 
            step="0.01"
            min="0"
            required
            defaultValue={initialData?.pricePerCm2 ?? 0}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Остаток (см²)</label>
          <input 
            type="number" 
            name="stock" 
            min="0"
            required
            defaultValue={initialData?.stock ?? 0}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Мин. остаток (алерт)</label>
          <input 
            type="number" 
            name="minStock" 
            min="0"
            required
            defaultValue={initialData?.minStock ?? 1000}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">URL изображения образца</label>
        <input 
          type="text" 
          name="imageUrl" 
          defaultValue={initialData?.imageUrl || ''}
          placeholder="https://storage.yandexcloud.net/... или /materials/acrylic.png"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание материала</label>
        <textarea 
          name="description" 
          rows={3}
          defaultValue={initialData?.description || ''}
          placeholder="Краткое описание свойств, прозрачности, текстуры..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить материал' : 'Создать материал')}
        </button>
        <Link 
          href="/admin/inventory"
          className="px-8 py-3 rounded-full font-extrabold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}