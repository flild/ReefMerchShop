'use client';

import { useState } from 'react';
import { createChecklistTemplate, updateChecklistTemplate } from '@/actions/admin/checklists';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function ChecklistTemplateForm({ initialData }: { initialData?: { id: string, title: string, description: string | null, imageUrl: string | null } }) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;

    if (!title) {
      setError('Заголовок обязателен');
      setIsPending(false);
      return;
    }

    try {
      if (initialData?.id) {
        await updateChecklistTemplate(initialData.id, { title, description, imageUrl });
        router.push(`/admin/content/checklists/${initialData.id}`);
      } else {
        const id = await createChecklistTemplate({ title, description, imageUrl });
        router.push(`/admin/content/checklists/${id}`);
      }
    } catch (err) {
      setError('Ошибка при сохранении');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 max-w-2xl flex flex-col gap-6">
      {error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-xl font-bold border-2 border-theme-yellow-text">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Название шаблона</label>
        <input
          type="text"
          name="title"
          defaultValue={initialData?.title}
          required
          placeholder="Например: Акриловый брелок"
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">Описание (опционально)</label>
        <textarea
          name="description"
          defaultValue={initialData?.description || ''}
          rows={3}
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-extrabold text-theme-text ml-2">URL изображения обложки (опционально)</label>
        <input
          type="url"
          name="imageUrl"
          defaultValue={initialData?.imageUrl || ''}
          placeholder="https://..."
          className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
        />
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (initialData ? 'Сохранить изменения' : 'Создать шаблон')}
        </button>
        <Link
          href="/admin/content/checklists"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
