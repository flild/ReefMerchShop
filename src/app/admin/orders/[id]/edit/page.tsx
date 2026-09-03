// src/app/admin/orders/[id]/edit/page.tsx
import { db } from '@/db';
import { orders, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound, redirect } from 'next/navigation';
import { OrderForm } from '@/components/admin/orders/OrderForm';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (session?.role === 'maker') {
    redirect('/admin/orders');
  }

  const { id } = await params;

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id));

  if (!order) {
    notFound();
  }

  const allUsers = await db.select().from(users);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Редактирование заказа</h1>
        <p className="text-theme-muted font-bold text-lg">
          Изменение суммы, привязки к аккаунту и ручных контактных данных.
        </p>
      </header>

      <OrderForm users={allUsers} initialData={order} />
    </div>
  );
}