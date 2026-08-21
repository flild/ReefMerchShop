'use client';

import { useActionState } from 'react';
import { createCategory, updateCategory } from '@/actions/admin/categories';
import Link from 'next/link';

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface CategoryFormProps {
  initialData?: CategoryData;
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const isEditing = !!initialData?.id;

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (isEditing) {
        return await updateCategory(initialData.id, formData);
      }
      return await createCategory(formData);
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

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Название</label>
          <input 
            type="text" 
            name="name" 
            required
            defaultValue={initialData?.name || ''}
            placeholder="Например: Акриловые стенды"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Slug (ЧПУ)</label>
          <input 
            type="text" 
            name="slug" 
            defaultValue={initialData?.slug || ''}
            placeholder="Оставь пустым для генерации"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание</label>
        <textarea 
          name="description" 
          rows={3}
          defaultValue={initialData?.description || ''}
          placeholder="Пару слов о категории..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить' : 'Создать')}
        </button>
        <Link href="/admin/portfolio/categories"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}