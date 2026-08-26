import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://danielcharlesevans.com/sitemap.xml',
    host: 'https://danielcharlesevans.com',
  };
}
