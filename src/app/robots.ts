import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/api/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://reef.studio'}/sitemap.xml`,
  };
}