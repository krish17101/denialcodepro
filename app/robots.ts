import type { MetadataRoute } from 'next';

const BASE_URL = 'https://denialcodepro.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Disallow search query URLs, dynamic slug pages (noindex until real content),
        // and any API or internal routes.
        disallow: [
          '/search',
          '/denial/',
          '/denial-codes/',
          '/remark-codes/',
          '/payers/',
          '/guides/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
