'use client';

import { useActionState, useState } from 'react';
import { createTemplate, updateTemplate } from '@/actions/admin/templates';
import Link from 'next/link';

interface TemplateData {
  id: string;
  title: string;
  description: string | null;
  size: string | null;
  productType: string | null;
  formatsJson: string;
}

interface FormatLink {
  format: string;
  url: string;
}

interface TemplateFormProps {
  initialData?: TemplateData;
}

export function TemplateForm({ initialData }: TemplateFormProps) {
  const isEditing = !!initialData?.id;

  let initialFormats: FormatLink[] = [];
  if (initialData?.formatsJson) {
    try {
      initialFormats = JSON.parse(initialData.formatsJson);
    } catch (e) {
      console.error('Ошибка парсинга formatsJson');
    }
  }

  const [formats, setFormats] = useState<FormatLink[]>(initialFormats);

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      formData.set('formatsJson', JSON.stringify(formats));

      if (initialData?.id) {
        return await updateTemplate(initialData.id, formData);
      }
      return await createTemplate(formData);
    },
    null
  );

  const addFormat = () => {
    setFormats([...formats, { format: '', url: '' }]);
  };

  const updateFormat = (index: number, key: keyof FormatLink, value: string) => {
    const newFormats = [...formats];
    newFormats[index][key] = value;
    setFormats(newFormats);
  };

  const removeFormat = (index: number) => {
    const newFormats = [...formats];
    newFormats.splice(index, 1);
    setFormats(newFormats);
  };

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
            name="title"
            required
            defaultValue={initialData?.title || ''}
            placeholder="Например: Брелок 5см"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Тип изделия</label>
          <input
            type="text"
            name="productType"
            defaultValue={initialData?.productType || ''}
            placeholder="Например: keychain"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2 col-span-2">
          <label className="font-extrabold text-theme-text ml-2">Описание</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={initialData?.description || ''}
            placeholder="Пару слов о шаблоне..."
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Размер (строка)</label>
          <input
            type="text"
            name="size"
            defaultValue={initialData?.size || ''}
            placeholder="Например: 50x50 мм"
            className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="font-extrabold text-theme-text ml-2">Файлы (Форматы и ссылки)</label>
          <button
            type="button"
            onClick={addFormat}
            className="text-theme-highlight font-bold text-sm hover:underline"
          >
            + Добавить файл
          </button>
        </div>

        {formats.length === 0 && (
          <div className="text-theme-muted text-sm font-medium italic ml-2">
            Нет добавленных файлов
          </div>
        )}

        {formats.map((f, i) => (
          <div key={i} className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Формат (например: PSD)"
              value={f.format}
              onChange={(e) => updateFormat(i, 'format', e.target.value)}
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all w-1/3"
            />
            <input
              type="text"
              placeholder="Ссылка на файл"
              value={f.url}
              onChange={(e) => updateFormat(i, 'url', e.target.value)}
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all w-full"
            />
            <button
              type="button"
              onClick={() => removeFormat(i)}
              className="text-theme-muted hover:text-red-500 transition-colors px-2"
              title="Удалить"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button
          type="submit"
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохраняем...' : (isEditing ? 'Обновить' : 'Создать')}
        </button>
        <Link href="/admin/templates"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Отмена
        </Link>
      </div>
    </form>
  );
}
