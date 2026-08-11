import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { HeroSection } from '@/components/home/HeroSection';
import { ToolsSection } from '@/components/home/ToolsSection';
// Эти компоненты сделаем в следующих шагах:
// import { HowItWorksSection } from '@/components/home/HowItWorksSection';
// import { PortfolioSection } from '@/components/home/PortfolioSection';
// import { MaterialsSection } from '@/components/home/MaterialsSection';
// import { TestimonialsSection } from '@/components/home/TestimonialsSection';
// import { FaqSection } from '@/components/home/FaqSection';
// import { CtaSection } from '@/components/home/CtaSection';

import { db } from '@/db';
import { materials, portfolioItems } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let recentWorks: any[] = [];
  let popMaterials: any[] = [];

  try {
    recentWorks = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt)).limit(4);
    popMaterials = await db.select().from(materials).limit(4);
  } catch (error) {
    console.error('Не смогли достучаться до БД на главной:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <JsonLd />
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <ToolsSection />
        
        {/* Заглушки для следующих секций, пока мы их не переписали */}
        {/* <HowItWorksSection /> */}
        {/* {recentWorks.length > 0 && <PortfolioSection items={recentWorks} />} */}
        {/* {popMaterials.length > 0 && <MaterialsSection items={popMaterials} />} */}
        {/* <TestimonialsSection /> */}
        {/* <FaqSection /> */}
        {/* <CtaSection /> */}
      </main>
      
      <Footer />
    </div>
  );
}