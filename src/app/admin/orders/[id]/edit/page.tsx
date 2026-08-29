import { db } from '@/db';
import Image from 'next/image';
import { 
  orders, 
  orderItems, 
  orderStatusHistory, 
  users, 
  materials, 
  accessories, 
  files,
  orderProofs 
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { OrderStatusSelect } from '@/components/admin/orders/OrderStatusSelect';
import { AddOrderItemModal } from '@/components/admin/orders/AddOrderItemModal';
import { UploadProofModal } from '@/components/admin/orders/UploadProofModal';
import { DeleteOrderItemButton } from '@/components/admin/orders/DeleteOrderItemButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Получаем сам заказ
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

  // 2. Получаем позиции заказа (теперь с названиями)
  const items = await db
    .select({
      id: orderItems.id,
      name: orderItems.name,
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

  // 3. Получаем цветопробы (привязанные к позициям)
  const proofs = await db
    .select({
      id: orderProofs.id,
      status: orderProofs.status,
      managerComment: orderProofs.managerComment,
      clientComment: orderProofs.clientComment,
      createdAt: orderProofs.createdAt,
      fileUrl: files.path,
      itemName: orderItems.name,
    })
    .from(orderProofs)
    .leftJoin(files, eq(orderProofs.fileId, files.id))
    .leftJoin(orderItems, eq(orderProofs.orderItemId, orderItems.id))
    .where(eq(orderProofs.orderId, id))
    .orderBy(desc(orderProofs.createdAt));

  // 4. История статусов
  const history = await db
    .select()
    .from(orderStatusHistory)
    .where(eq(orderStatusHistory.orderId, id))
    .orderBy(desc(orderStatusHistory.createdAt));

  // 5. Справочники для модалки добавления позиции
  const allMaterials = await db.select().from(materials);
  const allAccessories = await db.select().from(accessories);

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/orders" 
            className="p-3 bg-theme-surface anime-border anime-shadow hover:anime-shadow-hover hover:-translate-y-1 transition-all text-theme-text"
          >
            ← Назад
          </Link>
          <div>
            <h1 className="text-4xl font-display font-extrabold mb-1">
              Заказ #{order.orderNumber}
            </h1>
            <p className="text-theme-muted font-bold">
              от {order.createdAt instanceof Date ? order.createdAt.toLocaleString('ru-RU') : '—'}
            </p>
          </div>
        </div>
        <Link 
          href={`/admin/orders/${order.id}/edit`} 
          className="p-3 bg-theme-highlight/10 border-2 border-theme-highlight text-theme-highlight font-bold rounded-[16px] hover:bg-theme-highlight hover:text-theme-bg transition-colors whitespace-nowrap text-center"
        >
          Редактировать шапку
        </Link>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* ЛЕВАЯ КОЛОНКА (Товары и Цветопробы) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* СОСТАВ ЗАКАЗА */}
          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-extrabold text-theme-text">Состав заказа</h2>
            </div>
            
            <div className="flex flex-col gap-4">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-4 p-4 border-2 border-theme-border rounded-[24px] bg-theme-bg relative overflow-hidden group">
                {/* Кнопка удаления позиции */}
                <DeleteOrderItemButton itemId={item.id} orderId={order.id} />

                <div className="flex items-center justify-center w-12 h-12 bg-theme-surface border-2 border-theme-border rounded-full font-extrabold text-theme-text shrink-0">
                  {index + 1}
                </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-theme-highlight text-lg">
                        {item.name || 'Без названия'}
                      </span>
                      <span className="text-theme-muted font-bold text-xs uppercase tracking-wide mb-1">
                        {item.productType}
                      </span>
                      <span className="text-theme-text font-bold text-sm">
                        Материал: <span className="text-theme-muted">{item.materialName || '—'}</span>
                      </span>
                      <span className="text-theme-text font-bold text-sm">
                        Фурнитура: <span className="text-theme-muted">{item.accessoryName || '—'}</span>
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
                        ↓ Исходник
                      </a>
                    ) : (
                      <span className="text-theme-muted font-bold text-sm bg-theme-surface px-2 py-1 rounded-md border border-theme-border">Макет не загружен</span>
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
                <div className="p-8 text-center text-theme-muted font-bold border-2 border-dashed border-theme-border rounded-[24px]">
                  В заказе пока нет позиций.
                </div>
              )}
            </div>

            {/* Модалка добавления позиции */}
            <AddOrderItemModal orderId={order.id} materials={allMaterials} accessories={allAccessories} />
          </section>

          {/* ЦВЕТОПРОБЫ */}
          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-extrabold text-theme-text">Цветопробы</h2>
              
              {/* Внедряем нашу модалку */}
              <UploadProofModal orderId={order.id} items={items} />
            </div>

            <div className="flex flex-col gap-4">
              {proofs.map((proof) => (
                <div key={proof.id} className="p-5 bg-theme-bg border-2 border-theme-border rounded-[24px] flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`font-bold text-xs uppercase px-3 py-1 rounded-full ${
                        proof.status === 'approved' ? 'bg-theme-green-bg text-theme-green-text' : 
                        proof.status === 'rejected' ? 'bg-theme-yellow-bg text-theme-yellow-text' : 
                        'bg-theme-gray-bg text-theme-gray-text'
                      }`}>
                        {proof.status === 'approved' ? 'Утверждено' : proof.status === 'rejected' ? 'Отклонено' : 'Ожидает ответа'}
                      </span>
                      <span className="text-theme-muted font-bold text-sm">
                        {proof.createdAt?.toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-theme-muted text-sm font-bold">Позиция: </span>
                      <span className="text-theme-text font-extrabold">{proof.itemName || 'Неизвестно'}</span>
                    </div>

                    {proof.managerComment && (
                      <div className="mt-3 p-3 bg-theme-surface border border-theme-border rounded-[16px] text-sm">
                        <span className="text-theme-muted font-bold block mb-1">Менеджер:</span>
                        <p className="text-theme-text">{proof.managerComment}</p>
                      </div>
                    )}
                    {proof.clientComment && (
                      <div className="mt-2 p-3 bg-theme-highlight/10 border border-theme-highlight/30 rounded-[16px] text-sm">
                        <span className="text-theme-highlight font-bold block mb-1">Клиент:</span>
                        <p className="text-theme-text">{proof.clientComment}</p>
                      </div>
                    )}
                  </div>
                  
                  {proof.fileUrl && (
                    <div className="w-full sm:w-32 h-32 shrink-0 rounded-[16px] border-2 border-theme-border overflow-hidden relative bg-theme-surface flex items-center justify-center">
                      <a href={proof.fileUrl} target="_blank" rel="noreferrer" className="absolute inset-0 z-10" aria-label="Открыть фото" />
                      <span className="text-theme-highlight font-extrabold text-sm text-center px-2">Посмотреть фото</span>
                    </div>
                  )}
                </div>
              ))}

              {proofs.length === 0 && (
                <div className="p-6 text-center text-theme-muted font-bold">
                  Фотографии пилотных образцов еще не загружены.
                </div>
              )}
            </div>
          </section>

        </div>

        {/* ПРАВАЯ КОЛОНКА (Сайдбар) */}
        <div className="flex flex-col gap-8">
          
          {/* ДЕТАЛИ И КЛИЕНТ */}
          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-theme-muted font-bold">Итоговая стоимость</span>
              <div className="text-3xl font-display font-extrabold text-theme-text">
                {order.total.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="h-px w-full bg-theme-border" />

            <div className="flex flex-col gap-2">
              <span className="text-theme-muted font-bold">Статус заказа</span>
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
            </div>

            <div className="h-px w-full bg-theme-border" />

            <div className="flex flex-col gap-2">
              <span className="text-theme-muted font-bold">Клиент</span>
              <div className="text-xl font-extrabold text-theme-text">{displayName}</div>
              <div className="text-sm font-bold text-theme-muted">{displayContact}</div>
              {order.clientTelegram && !parsedDetails.customClientContact && (
                <div className="text-sm font-bold text-theme-highlight mt-1">TG: {order.clientTelegram}</div>
              )}
            </div>

            {parsedDetails.managerNote && (
              <>
                <div className="h-px w-full bg-theme-border" />
                <div className="flex flex-col gap-2">
                  <span className="text-theme-muted font-bold">Заметка менеджера</span>
                  <p className="text-theme-text font-bold text-sm bg-theme-bg p-4 rounded-[20px] border-2 border-theme-border">
                    {parsedDetails.managerNote}
                  </p>
                </div>
              </>
            )}
          </section>

          {/* ИСТОРИЯ */}
          <section className="bg-theme-surface anime-border anime-shadow rounded-[40px] p-8">
            <h2 className="text-xl font-display font-extrabold mb-6 text-theme-text">Лог изменений</h2>

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