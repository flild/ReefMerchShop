import { CollectForm } from '@/components/admin/collects/CollectForm';

export const dynamic = 'force-dynamic';

export default function NewCollectPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Новый коллект</h1>
        <p className="text-theme-muted font-bold text-lg">
          Запусти совместную закупку для художников.
        </p>
      </header>

      <CollectForm />
    </div>
  );
}