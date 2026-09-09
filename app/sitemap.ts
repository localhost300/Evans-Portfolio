import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.danielcharlesevans.online',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
