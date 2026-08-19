import { db } from '@/db';
import { orderProofs } from '@/db/schema';
import Image from 'next/image';
import { 
  orders, 
  orderItems, 
  orderStatusHistory, 
  users, 
  materials, 
  accessories, 
  files 
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderStatusSelect } from '@/components/admin/orders/OrderStatusSelect';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const proofs = await db
    .select({
      id: orderProofs.id,
      status: orderProofs.status,
      managerComment: orderProofs.managerComment,
      clientComment: orderProofs.clientComment,
      createdAt: orderProofs.createdAt,
      fileUrl: files.path,
    })
    .from(orderProofs)
    .leftJoin(files, eq(orderProofs.fileId, files.id))
    .where(eq(orderProofs.orderId, id))
    .orderBy(desc(orderProofs.createdAt));

  const orderResult = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      detailsJson: orders.detailsJson,
      createdAt: orders.createdAt,
      clientName: users.name,
      clientEmail: users.email,
      clientTelegram: users.telegramId,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id))
    .limit(1);

  if (!orderResult.length) {
    notFound();
  }
  const order = orderResult[0];
  let parsedDetails = { customClientName: '', customClientContact: '', managerNote: '' };
  if (order.detailsJson) {
    try {
      parsedDetails = JSON.parse(order.detailsJson);
    } catch (e) {}
  }

  const displayName = parsedDetails.customClientName || order.clientName || 'Гость / Без имени';
  const displayContact = parsedDetails.customClientContact || order.clientEmail || 'Контакты не указаны';

  const items = await db
    .select({
      id: orderItems.id,
      productType: orderItems.productType,
      quantity: orderItems.quantity,
      price: orderItems.price,
      areaCm2: orderItems.areaCm2,
      materialName: materials.name,
      accessoryName: accessories.name,
      fileName: files.name,
      filePath: files.path,
    })
    .from(orderItems)
    .leftJoin(materials, eq(orderItems.materialId, materials.id))
    .leftJoin(accessories, eq(orderItems.accessoryId, accessories.id))
    .leftJoin(files, eq(orderItems.fileId, files.id))
    .where(eq(orderItems.orderId, id));

  const history = await db
    .select()
    .from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, id))
    .orderBy(desc(orderStatusHistory.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link 
            href="/admin/orders" 
            className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
          >
            ← Назад
          </Link>
          <Link 
            href={`/admin/orders/${order.id}/edit`} 
            className="p-3 bg-theme-highlight/10 border-2 border-theme-highlight text-theme-highlight font-bold rounded-[16px] hover:bg-theme-highlight hover:text-theme-bg transition-colors"
          >
            Редактировать
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-display font-extrabold mb-1">
            Заказ #{order.orderNumber}
          </h1>
          <p className="text-theme-muted font-bold">
            от {order.createdAt instanceof Date ? order.createdAt.toLocaleString('ru-RU') : '—'}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 flex flex-col gap-8">
          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col sm:flex-row justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-theme-muted font-bold">Клиент</span>
              <div className="text-xl font-extrabold text-theme-text">{displayName}</div>
              <div className="text-sm font-bold text-theme-muted">{displayContact}</div>
              {order.clientTelegram && !parsedDetails.customClientContact && (
                <div className="text-sm font-bold text-theme-highlight">TG: {order.clientTelegram}</div>
              )}
              {parsedDetails.managerNote && (
                <div className="mt-2 p-3 bg-theme-bg border-2 border-theme-border rounded-[16px] text-sm font-bold text-theme-text">
                  <span className="text-theme-muted block mb-1">Заметка:</span>
                  {parsedDetails.managerNote}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-theme-muted font-bold">Итоговая стоимость</span>
              <div className="text-3xl font-display font-extrabold text-theme-text">
                {order.total.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-theme-muted font-bold">Текущий статус</span>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>
          </section>

          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
            <h2 className="text-2xl font-display font-extrabold mb-6">Состав заказа</h2>
            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border-2 border-theme-border rounded-[24px] bg-theme-bg">
                  <div className="flex items-center justify-center w-12 h-12 bg-theme-surface border-2 border-theme-border rounded-full font-extrabold text-theme-text shrink-0">
                    {index + 1}
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-theme-text text-lg uppercase tracking-wide">
                        {item.productType}
                      </span>
                      <span className="text-theme-muted font-bold text-sm mt-1">
                        Материал: <span className="text-theme-text">{item.materialName || '—'}</span>
                      </span>
                      <span className="text-theme-muted font-bold text-sm">
                        Фурнитура: <span className="text-theme-text">{item.accessoryName || '—'}</span>
                      </span>
                    </div>

                    <div className="flex flex-col md:items-end justify-center gap-1">
                      <span className="text-xl font-extrabold text-theme-text">
                        {item.quantity} шт.
                      </span>
                      <span className="text-theme-muted font-bold">
                        {item.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-end md:border-l-2 border-theme-border/50 md:pl-4 min-w-[140px]">
                    {item.filePath ? (
                      <a 
                        href={item.filePath} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-theme-highlight hover:underline font-bold text-sm flex items-center gap-2"
                      >
                        ↓ Скачать макет
                      </a>
                    ) : (
                      <span className="text-theme-muted font-bold text-sm">Макет не загружен</span>
                    )}
                    {item.areaCm2 && (
                      <span className="text-theme-muted font-bold text-xs mt-2">
                        S: {item.areaCm2} см²
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {items.length === 0 && (
                <div className="p-8 text-center text-theme-muted font-bold">
                  В этом заказе нет товаров (ошибка БД).
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          
          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
            <h2 className="text-2xl font-display font-extrabold mb-6">История изменений</h2>

            <div className="flex flex-col gap-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-theme-border">
              {history.map((entry) => (
                <div key={entry.id} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-theme-surface border-4 border-theme-highlight z-10" />
                  <div className="flex flex-col gap-1">
                    <span className="font-extrabold text-theme-text uppercase text-sm tracking-wider">
                      {entry.status}
                    </span>
                    <span className="text-theme-muted font-bold text-xs">
                      {entry.createdAt instanceof Date ? entry.createdAt.toLocaleString('ru-RU') : '—'}
                    </span>
                    {entry.comment && (
                      <p className="text-theme-text font-bold text-sm mt-2 p-3 bg-theme-bg border-2 border-theme-border rounded-[16px] bubble-shape">
                        {entry.comment}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <div className="pl-8 text-theme-muted font-bold text-sm">История пуста.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}