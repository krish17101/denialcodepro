import type { MetadataRoute } from 'next';

const BASE_URL = 'https://denialcodepro.com';

/**
 * V3 sitemap — Phase 1.
 *
 * Only includes routes that are real, indexable pages with honest content.
 * noindex pages (/search, /denial/[slug], /denial-codes/[slug], etc.) are
 * excluded until approved production data is connected.
 *
 * Do NOT include:
 *  - /search (noindex — arbitrary query URLs)
 *  - /denial/[slug] (noindex until content is verified)
 *  - /denial-codes/[slug] (noindex until content is verified)
 *  - /remark-codes/[slug] (noindex until content is verified)
 *  - /payers/[slug] (noindex until content is verified)
 *  - /guides/[slug] (noindex until content is verified)
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/denial-codes`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/remark-codes`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sources`,
      lastModified: lastmod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: lastmod,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: lastmod,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: lastmod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: lastmod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/disclaimer`,
      lastModified: lastmod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return staticRoutes;
}
