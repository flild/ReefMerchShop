import { AccessoryForm } from '@/components/admin/inventory/AccessoryForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NewAccessoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/inventory?tab=accessories" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Новая фурнитура</h1>
          <p className="text-theme-muted font-bold text-lg">
            Добавь кольца, цепочки, карабины и прочий лут на склад.
          </p>
        </div>
      </header>

      <AccessoryForm />
    </div>
  );
}