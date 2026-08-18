import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Нативный Image вместо сырого <img>
        img: ({ src, alt }) => {
        if (!src) return null;
        return (
            <span className="relative block w-full max-w-4xl aspect-video mx-auto my-8 bg-theme-surface anime-border anime-shadow overflow-hidden rounded-[24px]">
            <Image 
                src={src as string}   // 👈 явное приведение
                alt={alt || 'Изображение к гайду'} 
                fill 
                className="object-cover" 
                unoptimized 
            />
            </span>
        );
        },
        // Типографика и заголовки
        h2: ({ children }) => <h2 className="text-3xl font-display font-extrabold text-theme-text mt-12 mb-6">{children}</h2>,
        h3: ({ children }) => <h3 className="text-2xl font-display font-extrabold text-theme-text mt-8 mb-4">{children}</h3>,
        p: ({ children }) => <p className="text-theme-text font-bold text-lg leading-relaxed mb-6">{children}</p>,
        a: ({ href, children }) => <a href={href} className="text-theme-highlight hover:underline decoration-2 underline-offset-4">{children}</a>,
        // Обязательная настройка списков
        ul: ({ children }) => <ul className="list-disc list-inside mb-6 text-theme-text font-bold text-lg flex flex-col gap-2 pl-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside mb-6 text-theme-text font-bold text-lg flex flex-col gap-2 pl-4">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        // Цитаты и код
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-theme-highlight pl-6 italic text-theme-muted my-6 bg-theme-surface p-6 rounded-r-[24px] anime-shadow">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-theme-surface border border-theme-border text-theme-highlight px-2 py-1 rounded-md text-sm font-mono">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}