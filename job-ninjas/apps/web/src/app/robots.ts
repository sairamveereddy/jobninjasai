import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin',
        '/roles/*/board',
        '/teams',
        '/candidates/*',
        '/settings',
      ],
    },
    sitemap: 'https://jobninjas.ai/sitemap.xml',
  };
}
