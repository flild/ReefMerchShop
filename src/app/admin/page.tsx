import { db } from '@/db';
import { orders, materials, accessories, collects, collectParticipants } from '@/db/schema';
import { count, eq, lte, desc, and, gte, sql, or, lt, ne } from 'drizzle-orm';
import Link from 'next/link';
import { DashboardCharts } from '@/components/admin/DashboardCharts';

export const dynamic = 'force-dynamic';

const statusMap: Record<string, { label: string; color: string }> = {
  'new': { label: 'Новый', color: 'text-theme-highlight' },
  'layout': { label: 'Макет', color: 'text-theme-text' },
  'proofing': { label: 'Согласование', color: 'text-theme-yellow-text' },
  'production': { label: 'В производстве', color: 'text-theme-text' },
  'shipping': { label: 'Доставка', color: 'text-theme-muted' },
  'completed': { label: 'Выполнен', color: 'text-theme-green-text' },
};

// Map status to a hex color for the charts
const chartStatusColors: Record<string, string> = {
  'new': '#3B82F6', // theme-highlight
  'layout': '#64748B', // slate-500
  'proofing': '#EAB308', // theme-yellow-text
  'production': '#8B5CF6', // purple
  'shipping': '#94A3B8', // theme-muted
  'completed': '#22C55E', // theme-green-text
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

  // Считаем необработанные заявки в коллектах (только созданные или с загруженными макетами)
  const [unprocessedParticipants] = await db
    .select({ value: count() })
    .from(collectParticipants)
    .where(or(eq(collectParticipants.status, 'new'), eq(collectParticipants.status, 'layouts_uploaded')));

  // Проверяем наличие открытых коллектов
  const [activeCollects] = await db
    .select({ value: count() })
    .from(collects)
    .where(eq(collects.status, 'open'));

  const [lowMaterials] = await db
    .select({ value: count() })
    .from(materials)
    .where(lte(materials.stock, materials.minStock));

  const [lowAccessories] = await db
    .select({ value: count() })
    .from(accessories)
    .where(lte(accessories.stock, accessories.minStock));

  const totalLowStock = lowMaterials.value + lowAccessories.value;

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const inTwoDays = new Date();
  inTwoDays.setDate(inTwoDays.getDate() + 2);

  // Chart Data: Orders over last 30 days
  const thirtyDaysOrders = await db
    .select({
      createdAt: orders.createdAt,
      total: orders.total,
    })
    .from(orders)
    .where(gte(orders.createdAt, thirtyDaysAgo));

  // Group by date (YYYY-MM-DD)
  const timelineMap = new Map<string, { count: number; revenue: number }>();
  thirtyDaysOrders.forEach(o => {
    if (!o.createdAt) return;
    const dateStr = o.createdAt.toISOString().split('T')[0];
    const current = timelineMap.get(dateStr) || { count: 0, revenue: 0 };
    timelineMap.set(dateStr, {
      count: current.count + 1,
      revenue: current.revenue + (o.total || 0)
    });
  });

  const timelineData = Array.from(timelineMap.entries()).map(([date, data]) => ({
    date,
    count: data.count,
    revenue: data.revenue
  }));

  // Chart Data: Orders by Status
  const statusCounts = await db
    .select({
      status: orders.status,
      count: count()
    })
    .from(orders)
    .groupBy(orders.status);

  const statusData = statusCounts.map(s => ({
    status: s.status,
    label: statusMap[s.status]?.label || s.status,
    count: s.count,
    color: chartStatusColors[s.status] || '#CBD5E1'
  }));

  const completedThirtyDaysOrders = await db
    .select({ value: sql<number>`sum(${orders.total})` })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, thirtyDaysAgo),
        eq(orders.status, 'completed')
      )
    );

  const revenue = completedThirtyDaysOrders[0]?.value || 0;
  const formattedRevenue = new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB', 
    maximumFractionDigits: 0 
  }).format(revenue);

  // Deadline Alerts for Orders
  // 1. Overdue: deadline < now AND status not in (completed, shipping)
  const overdueOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      deadline: orders.deadline,
    })
    .from(orders)
    .where(
      and(
        lt(orders.deadline, now),
        ne(orders.status, 'completed'),
        ne(orders.status, 'shipping')
      )
    )
    .orderBy(orders.deadline)
    .limit(5);

  // 2. Nearing deadline: now <= deadline <= inTwoDays AND status not in (completed, shipping)
  const nearingDeadlineOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      deadline: orders.deadline,
    })
    .from(orders)
    .where(
      and(
        gte(orders.deadline, now),
        lte(orders.deadline, inTwoDays),
        ne(orders.status, 'completed'),
        ne(orders.status, 'shipping')
      )
    )
    .orderBy(orders.deadline)
    .limit(5);

  // Deadline Alerts for Collects
  // 1. Overdue collects: deadline < now AND status = 'open'
  const overdueCollects = await db
    .select({
      id: collects.id,
      title: collects.title,
      deadline: collects.deadline,
    })
    .from(collects)
    .where(
      and(
        lt(collects.deadline, now),
        eq(collects.status, 'open')
      )
    )
    .orderBy(collects.deadline)
    .limit(5);

  // 2. Nearing deadline collects: now <= deadline <= inTwoDays AND status = 'open'
  const nearingDeadlineCollects = await db
    .select({
      id: collects.id,
      title: collects.title,
      deadline: collects.deadline,
    })
    .from(collects)
    .where(
      and(
        gte(collects.deadline, now),
        lte(collects.deadline, inTwoDays),
        eq(collects.status, 'open')
      )
    )
    .orderBy(collects.deadline)
    .limit(5);

  // Добавили метрику заявок и расширили грид ниже
  const stats = [
    { label: 'Новых заказов', value: newOrders.value.toString(), alert: newOrders.value > 0 },
    { label: 'Требуют внимания', value: attentionOrders.value.toString(), alert: attentionOrders.value > 0 },
    { label: 'Новые заявки (Коллекты)', value: unprocessedParticipants.value.toString(), alert: unprocessedParticipants.value > 0 },
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

      {/* АЛЕРТ: Нет открытых коллектов */}
      {activeCollects.value === 0 && (
        <div className="bg-theme-yellow-bg text-theme-yellow-text px-6 py-5 rounded-[24px] font-bold border-2 border-theme-yellow-text flex flex-col md:flex-row gap-4 items-start md:items-center justify-between anime-shadow">
          <span className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            В данный момент нет открытых коллектов. Авторы не могут оставлять новые заявки!
          </span>
          <Link 
            href="/admin/collects/new" 
            className="bg-theme-surface text-theme-text px-5 py-2.5 rounded-[16px] border-2 border-theme-border hover:text-theme-highlight hover:bg-theme-bg transition-colors shrink-0 whitespace-nowrap"
          >
            + Запустить коллект
          </Link>
        </div>
      )}

      {/* Изменили сетку на xl:grid-cols-5, чтобы 5 карточек красиво встали в один ряд на больших экранах */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-theme-surface anime-border anime-shadow rounded-[32px] p-6 flex flex-col justify-between h-40"
          >
            <span className="text-theme-muted font-bold line-clamp-2">{stat.label}</span>
            <span className={`text-5xl font-display font-extrabold ${stat.alert ? 'text-theme-highlight' : 'text-theme-text'}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <DashboardCharts timelineData={timelineData} statusData={statusData} />

      {/* Алерты сроков и складские алерты */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Алерты сроков */}
        <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 min-h-[400px]">
          <h2 className="text-2xl font-display font-extrabold mb-6">Алерты сроков</h2>

          <div className="flex flex-col gap-4">
            {/* Просроченные заказы */}
            {overdueOrders.map(order => (
               <div key={`oo-${order.id}`} className="bg-theme-yellow-bg border-2 border-theme-yellow-text rounded-[20px] p-4 flex flex-col gap-1">
                 <div className="flex justify-between items-start">
                   <Link href={`/admin/orders/${order.id}`} className="font-extrabold text-theme-yellow-text hover:underline line-clamp-1">
                     Заказ #{order.orderNumber}
                   </Link>
                   <span className="text-xs font-bold px-2 py-1 bg-theme-surface rounded-full text-theme-muted border border-theme-yellow-text/30">Просрочен</span>
                 </div>
                 <div className="text-sm font-bold mt-1 text-theme-yellow-text/80">
                   Дедлайн был: {order.deadline?.toLocaleDateString('ru-RU')}
                 </div>
               </div>
            ))}

            {/* Просроченные коллекты */}
            {overdueCollects.map(collect => (
               <div key={`oc-${collect.id}`} className="bg-theme-yellow-bg border-2 border-theme-yellow-text rounded-[20px] p-4 flex flex-col gap-1">
                 <div className="flex justify-between items-start">
                   <Link href={`/admin/collects/${collect.id}`} className="font-extrabold text-theme-yellow-text hover:underline line-clamp-1" title={collect.title}>
                     Коллект: {collect.title}
                   </Link>
                   <span className="text-xs font-bold px-2 py-1 bg-theme-surface rounded-full text-theme-muted border border-theme-yellow-text/30">Просрочен</span>
                 </div>
                 <div className="text-sm font-bold mt-1 text-theme-yellow-text/80">
                   Дедлайн был: {collect.deadline?.toLocaleDateString('ru-RU')}
                 </div>
               </div>
            ))}

            {/* Заказы с горящим сроком */}
            {nearingDeadlineOrders.map(order => (
               <div key={`no-${order.id}`} className="bg-theme-bg border-2 border-theme-border rounded-[20px] p-4 flex flex-col gap-1">
                 <div className="flex justify-between items-start">
                   <Link href={`/admin/orders/${order.id}`} className="font-extrabold text-theme-text hover:underline line-clamp-1">
                     Заказ #{order.orderNumber}
                   </Link>
                   <span className="text-xs font-bold px-2 py-1 bg-theme-surface rounded-full text-theme-muted border border-theme-border">Скоро сдача</span>
                 </div>
                 <div className="text-sm font-bold mt-1">
                   Дедлайн: <span className="text-theme-highlight">{order.deadline?.toLocaleDateString('ru-RU')}</span>
                 </div>
               </div>
            ))}

            {/* Коллекты с горящим сроком */}
            {nearingDeadlineCollects.map(collect => (
               <div key={`nc-${collect.id}`} className="bg-theme-bg border-2 border-theme-border rounded-[20px] p-4 flex flex-col gap-1">
                 <div className="flex justify-between items-start">
                   <Link href={`/admin/collects/${collect.id}`} className="font-extrabold text-theme-text hover:underline line-clamp-1" title={collect.title}>
                     Коллект: {collect.title}
                   </Link>
                   <span className="text-xs font-bold px-2 py-1 bg-theme-surface rounded-full text-theme-muted border border-theme-border">Скоро сдача</span>
                 </div>
                 <div className="text-sm font-bold mt-1">
                   Дедлайн: <span className="text-theme-highlight">{collect.deadline?.toLocaleDateString('ru-RU')}</span>
                 </div>
               </div>
            ))}

            {overdueOrders.length === 0 && overdueCollects.length === 0 && nearingDeadlineOrders.length === 0 && nearingDeadlineCollects.length === 0 && (
              <div className="flex items-center justify-center h-[200px] text-theme-green-text font-bold">
                Нет горящих сроков. Вы восхитительны!
              </div>
            )}
          </div>
        </div>

        {/* Складские алерты */}
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
                    <span className="text-xs font-bold px-2 py-1 bg-theme-surface rounded-full text-theme-muted border border-theme-border">
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

      <div className="grid grid-cols-1 mt-4">
        <div className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 min-h-[400px]">
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
      </div>
    </div>
  );
}