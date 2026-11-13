import type { Metadata } from 'next';

export const origin = 'https://denialcodepro.com';
export const brand = 'DenialCodePro';

// Only pass a published pathname and editorial text. Never derive these from user queries.
export function pageSeo(path: string, title: string, description: string, type: 'website' | 'article' = 'website'): Metadata {
  const url = new URL(path, origin).href;
  const displayTitle = title + ' — ' + brand;
  return {
    title: { absolute: displayTitle },
    description,
    alternates: { canonical: url },
    openGraph: { type, locale: 'en_US', siteName: brand, url, title: displayTitle, description },
    twitter: { card: 'summary', title: displayTitle, description },
  };
}
