import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://jobninjas.ai';
  const now = new Date();

  const coreRoutes = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/product', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/templates', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/solutions', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/use-cases/technical', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/use-cases/high-volume', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/use-cases/executive', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/resources', changeFrequency: 'weekly' as const, priority: 0.7 },
    { path: '/login', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/terms', changeFrequency: 'monthly' as const, priority: 0.4 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.4 },
  ];

  return coreRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
