'use client';

import { useActionState } from 'react';
import { createAccessory, updateAccessory } from '@/actions/admin/inventory';
import Link from 'next/link';

interface AccessoryData {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
}

interface AccessoryFormProps {
  initialData?: AccessoryData;
}

export function AccessoryForm({ initialData }: AccessoryFormProps) {
  const isEditing = !!initialData?.id;

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (isEditing) {
        return await updateAccessory(initialData.id, formData);
      }
      return await createAccessory(formData);
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
        <label className="font-extrabold text-theme-text ml-2">Название фурнитуры</label>
        <input 
          type="text" 
          name="name" 
          required
          defaultValue={initialData?.name || ''}
          placeholder="Например: Кольцо с цепочкой 25мм"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Цена (₽/шт)</label>
          <input 
            type="number" 
            name="price" 
            min="0"
            defaultValue={initialData?.price ?? 0}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Остаток (шт)</label>
          <input 
            type="number" 
            name="stock" 
            defaultValue={initialData?.stock ?? 0}
            min="0"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Мин. остаток</label>
          <input 
            type="number" 
            name="minStock" 
            defaultValue={initialData?.minStock ?? 50}
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
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить фурнитуру' : 'Сохранить фурнитуру')}
        </button>
        <Link 
          href="/admin/inventory?tab=accessories"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}