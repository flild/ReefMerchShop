'use client';

import { useActionState } from 'react';
import { createPortfolioItem, updatePortfolioItem } from '@/actions/admin/portfolio';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface PortfolioItemData {
  id: string;
  title: string;
  categoryId: string | null;
  authorName: string | null;
  imageUrl: string;
  description: string | null;
}

interface PortfolioFormProps {
  categories: Category[];
  initialData?: PortfolioItemData;
}

export function PortfolioForm({ categories, initialData }: PortfolioFormProps) {
  const isEditing = !!initialData?.id;

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      if (isEditing) {
        return await updatePortfolioItem(initialData.id, formData);
      }
      return await createPortfolioItem(formData);
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

      {isEditing && (
        <input type="hidden" name="existingImageUrl" value={initialData.imageUrl} />
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Название работы</label>
        <input 
          type="text" 
          name="title" 
          required
          defaultValue={initialData?.title || ''}
          placeholder="Например: Акриловый стенд Cyberpunk"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Категория</label>
          <select 
            name="categoryId"
            defaultValue={initialData?.categoryId || ''}
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow appearance-none"
          >
            <option value="">Без категории</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Автор / Художник</label>
          <input 
            type="text" 
            name="authorName" 
            defaultValue={initialData?.authorName || ''}
            placeholder="Имя или псевдоним"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Фотография (файл)</label>
        <input 
          type="file" 
          name="image" 
          accept="image/*"
          required={!isEditing}
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-theme-highlight file:text-theme-bg hover:file:cursor-pointer"
        />
        {isEditing && (
          <p className="text-sm font-bold text-theme-muted ml-2 mt-1">
            Загрузи новый файл, если хочешь заменить текущую пикчу.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание</label>
        <textarea 
          name="description" 
          rows={4}
          defaultValue={initialData?.description || ''}
          placeholder="Пару слов о проекте..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить работу' : 'Сохранить работу')}
        </button>
        <Link 
          href="/admin/portfolio"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}