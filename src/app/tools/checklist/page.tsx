// src/app/tools/checklist/page.tsx
import { getChecklistTemplates } from '@/actions/admin/checklists';
import { ChecklistConstructorClient } from './ChecklistConstructorClient';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { ChevronRight, CheckSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChecklistGeneratorPage() {
  const templates = await getChecklistTemplates();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 py-16 bg-theme-bg manga-dots">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <nav className="flex items-center gap-2 text-sm text-theme-muted mb-8 font-medium" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-theme-highlight transition-colors">Главная</Link>
            <ChevronRight size={14} />
            <Link href="/tools" className="hover:text-theme-highlight transition-colors">Инструменты</Link>
            <ChevronRight size={14} />
            <span className="text-theme-text" aria-current="page">Генератор чек-листа</span>
          </nav>

          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-theme-surface rounded-full text-theme-highlight font-bold text-sm tracking-wide mb-6 anime-border shadow-[2px_2px_0_0_var(--theme-border)] rotate-[-1deg]">
              <CheckSquare size={16} />
              Инструменты
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-black text-theme-text mb-6">Генератор чек-листа</h1>
            <p className="text-xl text-theme-muted font-medium leading-relaxed max-w-3xl">
              Соберите индивидуальный чек-лист для вашего заказа. Заполните данные, загрузите картинки и получите готовый документ.
            </p>
          </div>

          <ChecklistConstructorClient templates={templates} />
        </div>
      </main>

      <Footer />
    </div>
  );
}