import { db } from '@/db';
import { users } from '@/db/schema';
import { OrderForm } from '@/components/admin/orders/OrderForm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function NewOrderPage() {
  const allUsers = await db.select().from(users);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <Link 
          href="/admin/orders" 
          className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
        >
          ← Назад
        </Link>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Новый заказ</h1>
          <p className="text-theme-muted font-bold text-lg">
            Создание карточки заказа вручную.
          </p>
        </div>
      </header>

      <OrderForm users={allUsers} />
    </div>
  );
}