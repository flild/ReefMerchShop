import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, Handshake, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalDocumentProps {
  kind: 'privacy' | 'terms';
  title: string;
  description: string;
  summary: ReactNode;
  sections: readonly LegalSection[];
}

export function LegalDocument({ kind, title, description, summary, sections }: LegalDocumentProps) {
  const isPrivacy = kind === 'privacy';
  const Icon = isPrivacy ? ShieldCheck : Handshake;
  const otherDocument = isPrivacy
    ? { href: '/terms', label: 'Условия оферты' }
    : { href: '/privacy', label: 'Политика конфиденциальности' };

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg font-sans text-theme-text">
      <Header />
      <main className="container mx-auto flex-1 px-4 py-10 sm:py-16 max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] anime-border anime-shadow bg-theme-surface p-6 sm:rounded-[40px] sm:p-10">
          <div className="manga-dots pointer-events-none absolute inset-0 opacity-15" aria-hidden="true" />
          <div className="relative">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 ${isPrivacy ? 'bg-theme-accent/10 text-theme-accent' : 'bg-theme-yellow-bg text-theme-yellow-text'}`}>
                <Icon size={18} aria-hidden="true" />
                {isPrivacy ? 'Твои данные' : 'Твой заказ'}
              </span>
              <span className="text-theme-muted">Редакция от <time dateTime="2026-10-23">23 октября 2026</time></span>
            </div>
            <h1 className={`max-w-4xl break-words font-display font-black leading-tight ${isPrivacy ? 'text-[clamp(1.25rem,6vw,3rem)]' : 'text-3xl sm:text-5xl'}`}>{title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-theme-muted sm:text-lg">{description}</p>
          </div>
        </div>

        <div className="my-8 sm:my-10">{summary}</div>

        <div className="grid items-start gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[24px] anime-border bg-theme-surface p-5 lg:sticky lg:top-28">
            <nav aria-label="Содержание документа">
              <h2 className="mb-4 font-display text-lg font-black">Содержание</h2>
              <ol className="space-y-2">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="anime-border block rounded-xl px-3 py-2 text-sm font-bold transition-colors hover:bg-theme-accent/10 hover:text-theme-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-accent">
                      <span className="mr-2 text-theme-muted">{index + 1}.</span>{section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article aria-label={title} className="min-w-0 rounded-[32px] anime-border anime-shadow bg-theme-surface p-5 sm:p-10">
            {sections.map((section, index) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-28 border-b border-theme-border py-7 first:pt-0 last:border-0 last:pb-0">
                <h2 id={`${section.id}-heading`} className="mb-4 font-display text-xl font-black sm:text-2xl">
                  <span className="mr-2 text-theme-accent">{index + 1}.</span>{section.title}
                </h2>
                <div className="space-y-4 break-words leading-relaxed text-theme-text [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                  {section.content}
                </div>
              </section>
            ))}
          </article>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[24px] anime-border bg-theme-surface p-6">
          <p className="font-bold text-theme-muted">{isPrivacy ? 'Как оформить и получить заказ?' : 'Как мы обрабатываем твои данные?'}</p>
          <Link href={otherDocument.href} className="anime-button inline-flex items-center gap-2 px-5 py-3 text-sm">
            {otherDocument.label}<ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
