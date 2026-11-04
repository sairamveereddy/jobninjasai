import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jobninjas.ai';
  const now = new Date();

  const coreRoutes = [
    '',
    '/pricing',
    '/templates',
    '/solutions',
    '/product',
    '/resources',
    '/terms',
    '/privacy',
  ];

  return coreRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
