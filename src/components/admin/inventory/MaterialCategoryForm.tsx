'use client';

import { useActionState } from 'react';
import { createMaterialCategory, updateMaterialCategory } from '@/actions/admin/inventory';
import Link from 'next/link';

export interface MaterialCategoryFormData {
  id: string;
  name: string;
  slug: string;
}

interface MaterialCategoryFormProps {
  initialData?: MaterialCategoryFormData;
}

interface FormState {
  error?: string;
  success?: boolean;
}

export function MaterialCategoryForm({ initialData }: MaterialCategoryFormProps) {
  const isEditing = Boolean(initialData?.id);

  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    async (_prevState: FormState | null, formData: FormData) => {
      if (isEditing && initialData) {
        return await updateMaterialCategory(initialData.id, formData);
      }
      return await createMaterialCategory(formData);
    },
    null
  );

  return (
    <form action={formAction} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-2xl font-extrabold border-2 border-theme-border">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Название категории</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={initialData?.name || ''}
            placeholder="Например: Плотные"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button
          type="submit"
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить категорию' : 'Создать категорию')}
        </button>
        <Link
          href="/admin/inventory?tab=categories"
          className="px-8 py-3 rounded-full font-extrabold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
