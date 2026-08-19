import { db } from '@/db';
import { orders, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { OrderStatusSelect } from '@/components/admin/orders/OrderStatusSelect';

export const dynamic = 'force-dynamic';

// Хелпер для определения цвета статуса по дизайн-системе
function getStatusColorClass(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-theme-green-bg border-theme-green-text';
    case 'proofing':
      return 'bg-theme-yellow-bg border-theme-yellow-text';
    case 'new':
      return 'bg-theme-bg border-theme-highlight';
    default:
      return 'bg-theme-gray-bg border-theme-gray-text';
  }
}

export default async function OrdersAdminPage() {
  const ordersList = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
      clientName: users.name,
      clientEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-2">Заказы</h1>
          <p className="text-theme-muted font-bold text-lg">
            Управление текущими заказами и статусами производства
          </p>
        </div>
        <Link href="/admin/orders/new" className="anime-button px-6 py-3 text-lg block text-center whitespace-nowrap">
          + Создать заказ
        </Link>
      </header>

      <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-theme-border text-theme-muted text-sm uppercase tracking-wider">
                <th className="p-5 font-extrabold">№ Заказа</th>
                <th className="p-5 font-extrabold">Клиент</th>
                <th className="p-5 font-extrabold">Сумма</th>
                <th className="p-5 font-extrabold">Статус</th>
                <th className="p-5 font-extrabold">Дата создания</th>
                <th className="p-5 font-extrabold text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {ordersList.map((order) => (
                <tr 
                  key={order.id} 
                  className="border-b border-theme-border/50 hover:bg-theme-bg/50 transition-colors group"
                >
                  <td className="p-5">
                    <Link 
                      href={`/admin/orders/${order.id}`} 
                      className="font-extrabold text-theme-highlight hover:underline text-lg"
                    >
                      #{order.orderNumber}
                    </Link>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-theme-text">{order.clientName || 'Без имени'}</div>
                    <div className="text-theme-muted text-sm font-bold">{order.clientEmail || '—'}</div>
                  </td>
                  <td className="p-5">
                    <div className="font-extrabold text-theme-text text-lg">
                      {order.total.toLocaleString('ru-RU')} ₽
                    </div>
                  </td>
                  <td className="p-5 flex items-center gap-3">
                    {/* Цветной индикатор статуса */}
                    <span className={`w-3 h-3 rounded-full border-2 ${getStatusColorClass(order.status)}`} />
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                  <td className="p-5 text-theme-muted font-bold text-sm">
                    {order.createdAt instanceof Date 
                      ? order.createdAt.toLocaleDateString('ru-RU') 
                      : '—'}
                  </td>
                  <td className="p-5 text-right">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="anime-button px-5 py-2 text-sm inline-block"
                    >
                      Детали
                    </Link>
                  </td>
                </tr>
              ))}

              {ordersList.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-theme-muted font-bold text-lg">
                    Заказов пока нет.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}