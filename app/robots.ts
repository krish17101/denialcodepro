import type { MetadataRoute } from 'next';

const BASE_URL = 'https://denialcodepro.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow search query URLs to prevent crawler traps
        disallow: [
          '/search',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
