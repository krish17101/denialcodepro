import type { MetadataRoute } from 'next';
import { codes } from './lib/codes';

const BASE_URL = 'https://denialcodepro.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/about', '/adjustment-codes', '/privacy-policy', '/terms', '/disclaimer'];
  const lastmod = new Date().toISOString();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: lastmod,
    changeFrequency: 'weekly',
  }));

  const codeEntries: MetadataRoute.Sitemap = codes.map((code) => ({
    url: `${BASE_URL}/code/${encodeURIComponent(code.id)}`,
    lastModified: lastmod,
    changeFrequency: 'weekly' as const,
  }));

  return [...staticEntries, ...codeEntries];
}
