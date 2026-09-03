// src/app/admin/inventory/types/new/page.tsx
import { MaterialTypeForm } from '@/components/admin/inventory/MaterialTypeForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NewMaterialTypePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/inventory?tab=types" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Новый тип материала</h1>
          <p className="text-theme-muted font-bold text-lg">
            Добавь новый базовый тип (акрил, винил, металл) в справочник.
          </p>
        </div>
      </header>

      <MaterialTypeForm />
    </div>
  );
}