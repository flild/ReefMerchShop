import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import AdminDashboard from './AdminDashboard';
import { db } from '@/db';
import { orders, materials, accessories, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const metadata = {
  title: 'Панель администратора | Reef',
};

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let mappedOrders: any[] = [];
  let lowStockItems: { id: string, type: 'material' | 'accessory', name: string, current: number, minimum: number }[] = [];

  try {
    const dbOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      total: orders.total,
      createdAt: orders.createdAt,
      customerEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

    mappedOrders = dbOrders.map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customer: o.customerEmail || 'Unknown',
      date: o.createdAt ? format(o.createdAt, 'dd MMM, HH:mm', { locale: ru }) : 'Unknown',
      status: o.status,
      total: o.total,
    }));

    const dbMaterials = await db.select().from(materials);
    const dbAccessories = await db.select().from(accessories);

    dbMaterials.forEach(m => {
      if (m.stock < 100) {
        lowStockItems.push({ id: m.id, type: 'material', name: m.name, current: m.stock, minimum: 100 });
      }
    });

    dbAccessories.forEach(a => {
      if (a.stock < a.minStock) {
        lowStockItems.push({ id: a.id, type: 'accessory', name: a.name, current: a.stock, minimum: a.minStock });
      }
    });
  } catch (error) {
    console.error('Failed to load admin data:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <Header />
      
      <main className="flex-1 py-8">
        <AdminDashboard orders={mappedOrders} lowStockItems={lowStockItems} />
      </main>
      
    </div>
  );
}
