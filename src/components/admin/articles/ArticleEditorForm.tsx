'use client';

import { useActionState, useRef, useTransition, useState } from 'react';
import { updateArticle, uploadArticleImage } from '@/actions/admin/articles';
import Link from 'next/link';
import { Image as ImageIcon } from 'lucide-react';

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  coverImage: string | null;
  contentMd: string;
}

export function ArticleEditorForm({ article }: { article: ArticleData }) {
  const updateWithId = updateArticle.bind(null, article.id);
  const [state, formAction, isPending] = useActionState(updateWithId, null);
  
  const [isUploading, startUpload] = useTransition();
  const [coverUrl, setCoverUrl] = useState(article.coverImage || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Единый обработчик загрузки картинок
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isCover: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    startUpload(async () => {
      const formData = new FormData();
      formData.append('file', file);
      
      const result = await uploadArticleImage(formData);
      
      if (result.error) {
        alert(result.error);
        return;
      }

      if (result.url) {
        if (isCover) {
          setCoverUrl(result.url);
        } else {
          // Вставка URL картинки в место курсора в textarea
          const textarea = textareaRef.current;
          if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const imgMarkdown = `\n![Описание изображения](${result.url})\n`;
            
            textarea.value = text.substring(0, start) + imgMarkdown + text.substring(end);
            // Возвращаем фокус
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + imgMarkdown.length;
          }
        }
      }
    });
    
    // Сбрасываем инпут
    event.target.value = '';
  };

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state?.error && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text p-4 rounded-[20px] font-bold border-2 border-theme-yellow-text">
          {state.error}
        </div>
      )}
      {state?.success && (
        <div className="bg-theme-green-bg text-theme-green-text p-4 rounded-[20px] font-bold border-2 border-theme-green-text">
          {state.message}
        </div>
      )}

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Название</label>
            <input 
              type="text" 
              name="title" 
              defaultValue={article.title}
              required
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-extrabold text-theme-text ml-2">Slug (URL)</label>
            <input 
              type="text" 
              name="slug" 
              defaultValue={article.slug}
              required
              className="bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-extrabold text-theme-text ml-2">Обложка статьи (URL)</label>
          <div className="flex gap-4">
            <input 
              type="text" 
              name="coverImage" 
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://... или загрузите файл"
              className="flex-1 bg-theme-bg border-2 border-theme-border rounded-[20px] px-5 py-3 font-bold text-theme-text outline-none focus:border-theme-highlight anime-shadow transition-all"
            />
            <label className="anime-button px-6 py-3 cursor-pointer flex items-center gap-2 whitespace-nowrap">
              {isUploading ? 'Загрузка...' : 'Загрузить фото'}
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, true)} 
                className="hidden" 
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] flex flex-col overflow-hidden min-h-[600px]">
        <div className="bg-theme-bg p-4 border-b-2 border-theme-border flex items-center justify-between">
          <span className="font-extrabold text-theme-text">Редактор Markdown</span>
          
          <label className="p-2 bg-theme-surface border-2 border-theme-border rounded-full hover:border-theme-highlight text-theme-muted hover:text-theme-highlight cursor-pointer transition-all disabled:opacity-50" title="Вставить картинку в текст">
            <ImageIcon className="w-5 h-5" />
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleImageUpload(e, false)} 
              className="hidden" 
              disabled={isUploading}
            />
          </label>
        </div>
        
        <textarea
          ref={textareaRef}
          name="contentMd"
          defaultValue={article.contentMd}
          className="flex-1 w-full bg-theme-surface p-6 font-mono text-sm text-theme-text outline-none resize-none"
          placeholder="Пиши гайд здесь..."
        />
      </div>

      <div className="flex items-center gap-4 bg-theme-surface anime-border anime-shadow rounded-[32px] p-6 sticky bottom-6">
        <button 
          type="submit" 
          disabled={isPending}
          className="anime-button px-8 py-3 text-lg disabled:opacity-50"
        >
          {isPending ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
        <Link 
          href="/admin/content/articles"
          className="px-8 py-3 rounded-full font-bold text-theme-muted hover:text-theme-text transition-colors"
        >
          Вернуться к списку
        </Link>
      </div>
    </form>
  );
}