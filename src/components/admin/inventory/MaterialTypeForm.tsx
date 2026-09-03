// src/components/admin/inventory/MaterialTypeForm.tsx
'use client';

import { useActionState } from 'react';
import { createMaterialType, updateMaterialType } from '@/actions/admin/inventory';
import Link from 'next/link';

export interface MaterialTypeFormData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface MaterialTypeFormProps {
  initialData?: MaterialTypeFormData;
}

interface FormState {
  error?: string;
  success?: boolean;
}

export function MaterialTypeForm({ initialData }: MaterialTypeFormProps) {
  const isEditing = Boolean(initialData?.id);

  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    async (_prevState: FormState | null, formData: FormData) => {
      if (isEditing && initialData) {
        return await updateMaterialType(initialData.id, formData);
      }
      return await createMaterialType(formData);
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Название типа</label>
          <input 
            type="text" 
            name="name" 
            required
            defaultValue={initialData?.name || ''}
            placeholder="Например: Дерево"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Slug (Идентификатор)</label>
          <input 
            type="text" 
            name="slug" 
            required
            defaultValue={initialData?.slug || ''}
            placeholder="wood"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all font-mono"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание (Опционально)</label>
        <textarea 
          name="description" 
          rows={3}
          defaultValue={initialData?.description || ''}
          placeholder="Краткое описание типа материалов..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-2">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить тип' : 'Создать тип')}
        </button>
        <Link 
          href="/admin/inventory?tab=types"
          className="px-8 py-3 rounded-full font-extrabold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}