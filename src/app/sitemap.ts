import { MetadataRoute } from 'next';
import { db } from '@/db';
import { portfolioItems, materials } from '@/db/schema';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://reef.studio'; // TODO: Замени на свой домен

  // Статичные маршруты
  const staticRoutes = [
    '',
    '/calculator',
    '/portfolio',
    '/materials',
    '/collects',
    '/templates',
    '/tools/mockup',
    '/tools/check',
    '/tools/checklist',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Динамические страницы портфолио
    const works = await db.select({ 
      id: portfolioItems.id, 
      createdAt: portfolioItems.createdAt 
    }).from(portfolioItems);
    
    const portfolioRoutes = works.map((work) => ({
      url: `${baseUrl}/portfolio/${work.id}`,
      lastModified: work.createdAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Динамические страницы материалов
    const mats = await db.select({ id: materials.id }).from(materials);
    const materialsRoutes = mats.map((mat) => ({
      url: `${baseUrl}/materials/${mat.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...portfolioRoutes, ...materialsRoutes];
  } catch (error) {
    console.error('Sitemap DB error:', error);
    // Фолбэк, если БД отвалилась (чтобы билд не падал)
    return staticRoutes;
  }
}