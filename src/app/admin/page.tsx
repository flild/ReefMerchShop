import { db } from '@/db';
import { orders, materials, accessories } from '@/db/schema';
import { count, eq, lte, desc, and, gte, sql } from 'drizzle-orm';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const statusMap: Record<string, { label: string; color: string }> = {
  'new': { label: 'Новый', color: 'text-theme-highlight' },
  'layout': { label: 'Макет', color: 'text-theme-text' },
  'proofing': { label: 'Согласование', color: 'text-theme-yellow-text' },
  'production': { label: 'В производстве', color: 'text-theme-text' },
  'shipping': { label: 'Доставка', color: 'text-theme-muted' },
  'completed': { label: 'Выполнен', color: 'text-theme-green-text' },
};

export default async function AdminDashboard() {
  const [newOrders] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, 'new'));

  const [attentionOrders] = await db
    .select({ value: count() })
    .from(orders)
    .where(eq(orders.status, 'proofing'));

  const [lowMaterials] = await db
    .select({ value: count() })
    .from(materials)
    .where(lte(materials.stock, materials.minStock));

  const [lowAccessories] = await db
    .select({ value: count() })
    .from(accessories)
    .where(lte(accessories.stock, accessories.minStock));

  const totalLowStock = lowMaterials.value + lowAccessories.value;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const [revenueResult] = await db
    .select({ value: sql<number>`sum(${orders.total})` })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, thirtyDaysAgo),
        eq(orders.status, 'completed')
      )
    );

  const revenue = revenueResult?.value || 0;
  const formattedRevenue = new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB', 
    maximumFractionDigits: 0 
  }).format(revenue);

  const stats = [
    { label: 'Новых заказов', value: newOrders.value.toString(), alert: newOrders.value > 0 },
    { label: 'Требуют внимания (Пруфы)', value: attentionOrders.value.toString(), alert: attentionOrders.value > 0 },
    { label: 'Заканчивается на складе', value: totalLowStock.toString(), alert: totalLowStock > 0 },
    { label: 'Выручка (30 дней)', value: formattedRevenue, alert: false },
  ];

  const recentOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5);

  const lowMaterialsList = await db
    .select({
      id: materials.id,
      name: materials.name,
      stock: materials.stock,
      minStock: materials.minStock,
      type: sql<string>`'Материал'`,
    })
    .from(materials)
    .where(lte(materials.stock, materials.minStock))
    .limit(4);

  const lowAccessoriesList = await db
    .select({
      id: accessories.id,
      name: accessories.name,
      stock: accessories.stock,
      minStock: accessories.minStock,
      type: sql<string>`'Фурнитура'`,
    })
    .from(accessories)
    .where(lte(accessories.stock, accessories.minStock))
    .limit(4);

  const stockAlerts = [...lowMaterialsList, ...lowAccessoriesList].slice(0, 6);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-display font-extrabold mb-2">Обзорная сводка</h1>
        <p className="text-theme-muted font-bold text-lg">
          Добро пожаловать в панель управления. Пора навести здесь суету.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-theme-surface anime-border anime-shadow rounded-[32px] p-6 flex flex-col justify-between h-40"
          >
            <span className="text-theme-muted font-bold">{stat.label}</span>
            <span className={`text-5xl font-display font-extrabold ${stat.alert ? 'text-theme-highlight' : 'text-theme-text'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2 bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-extrabold">Последние заказы</h2>
            <Link href="/admin/orders" className="text-theme-muted font-bold hover:text-theme-text transition-colors">
              Смотреть все →
            </Link>
          </div>
          
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-theme-border text-theme-muted">
                    <th className="pb-3 font-bold">Номер</th>
                    <th className="pb-3 font-bold">Дата</th>
                    <th className="pb-3 font-bold">Статус</th>
                    <th className="pb-3 font-bold text-right">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const date = order.createdAt 
                      ? order.createdAt.toLocaleDateString('ru-RU')
                      : '—';
                    const statusInfo = statusMap[order.status] || { label: order.status, color: 'text-theme-text' };
                    
                    return (
                      <tr key={order.id} className="border-b-2 border-theme-border/50 last:border-0">
                        <td className="py-4 font-extrabold text-theme-text">{order.orderNumber}</td>
                        <td className="py-4 font-bold text-theme-muted">{date}</td>
                        <td className={`py-4 font-extrabold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </td>
                        <td className="py-4 font-extrabold text-right">
                          {order.total} ₽
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-theme-muted font-bold">
              Пока нет заказов.
            </div>
          )}
        </div>

        <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 min-h-[400px]">
          <h2 className="text-2xl font-display font-extrabold mb-6">Складские алерты</h2>
          
          {stockAlerts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {stockAlerts.map((alert) => (
                <div key={`${alert.type}-${alert.id}`} className="bg-theme-bg border-2 border-theme-border rounded-[20px] p-4 flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-theme-text line-clamp-1" title={alert.name}>
                      {alert.name}
                    </span>
                    <span className="text-xs font-bold px-2 py-1 bg-theme-surface rounded-full text-theme-muted">
                      {alert.type}
                    </span>
                  </div>
                  <div className="text-sm font-bold mt-1">
                    Остаток: <span className="text-theme-yellow-text font-extrabold">{alert.stock}</span> / <span className="text-theme-muted">{alert.minStock}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-theme-green-text font-bold">
              Всё в порядке, запасов хватает.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}