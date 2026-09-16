import { db } from '@/db';
import {
  pricingTiers,
  pricingSpecialProducts,
  pricingSmallBatchRules,
  pricingModifiers,
  accessories
} from '@/db/schema';
import { PricingClient } from '@/components/admin/PricingClient';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'manager')) {
    redirect('/');
  }

  const [
    dbPricingTiers,
    dbSpecialProducts,
    dbSmallBatchRules,
    dbModifiers,
    dbAccessories
  ] = await Promise.all([
    db.select().from(pricingTiers),
    db.select().from(pricingSpecialProducts),
    db.select().from(pricingSmallBatchRules),
    db.select().from(pricingModifiers),
    db.select().from(accessories),
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-display font-black text-theme-text mb-8">Управление ценами</h1>
      <PricingClient
        initialPricingTiers={dbPricingTiers}
        initialSpecialProducts={dbSpecialProducts}
        initialSmallBatchRules={dbSmallBatchRules}
        initialModifiers={dbModifiers}
        initialAccessories={dbAccessories}
      />
    </div>
  );
}
