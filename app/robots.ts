import type { MetadataRoute } from 'next';

const BASE_URL = 'https://denialcodepro.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Search pages carry noindex. Allow crawling so Google can read it.
        // Do not generate crawlable links to arbitrary query permutations.
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
