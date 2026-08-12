import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';

import { HeroSection } from '@/components/home/HeroSection';
import { PortfolioSection } from '@/components/home/PortfolioSection';
import { CollectsSection } from '@/components/home/CollectsSection';
import { MaterialsSection } from '@/components/home/MaterialsSection';
import { ToolsSection } from '@/components/home/ToolsSection';
import { TemplatesSection } from '@/components/home/TemplatesSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { CtaSection } from '@/components/home/CtaSection';

import { db } from '@/db';
import { materials, portfolioItems, collects, templates } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let recentWorks: any[] = [];
  let popMaterials: any[] = [];
  let activeCollects: any[] = [];
  let availableTemplates: any[] = [];

  try {
    // Берем 8 свежих работ, чтобы витрина была жирной
    recentWorks = await db.select().from(portfolioItems).orderBy(desc(portfolioItems.createdAt)).limit(8);
    popMaterials = await db.select().from(materials).limit(4);
    // Тянем только открытые коллекты
    activeCollects = await db.select().from(collects).where(eq(collects.status, 'open')).limit(2);
    availableTemplates = await db.select().from(templates).limit(4);
  } catch (error) {
    console.error('БД отвалилась на главной:', error);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <JsonLd />
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <HeroSection />
        
        {/* Визуал на первое место */}
        {recentWorks.length > 0 && <PortfolioSection items={recentWorks} />}
        
        {/* Драйвер продаж */}
        {activeCollects.length > 0 && <CollectsSection items={activeCollects} />}
        
        {popMaterials.length > 0 && <MaterialsSection items={popMaterials} />}
        
        <ToolsSection />
        
        {/* SEO-магнит */}
        {availableTemplates.length > 0 && <TemplatesSection items={availableTemplates} />}
        
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}