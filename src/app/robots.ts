import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/api/'],
    },
    sitemap: 'https://reef.studio/sitemap.xml', // TODO: Замени домен
  };
}