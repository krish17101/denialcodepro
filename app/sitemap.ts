import type { MetadataRoute } from 'next';
import { knowledgeBase, getDenialSlug, getCarcSlug, getRarcSlug, getPayerSlug } from '../lib/v3/knowledge/data';

const BASE_URL = 'https://denialcodepro.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: lastmod, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/denial-codes`, lastModified: lastmod, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/remark-codes`, lastModified: lastmod, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/guides`, lastModified: lastmod, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/sources`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/methodology`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/about`, lastModified: lastmod, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`, lastModified: lastmod, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [];

  knowledgeBase.denial_fingerprints?.forEach((df) => {
    if (df.publication.indexable) {
      dynamicRoutes.push({
        url: `${BASE_URL}/denial/${getDenialSlug(df)}`,
        lastModified: lastmod,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  knowledgeBase.carcs?.forEach((carc) => {
    if (carc.publication.indexable && carc.code !== '15') {
      dynamicRoutes.push({
        url: `${BASE_URL}/denial-codes/${getCarcSlug(carc.code)}`,
        lastModified: lastmod,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  });

  knowledgeBase.rarcs?.forEach((rarc) => {
    if (rarc.publication.indexable) {
      dynamicRoutes.push({
        url: `${BASE_URL}/remark-codes/${getRarcSlug(rarc.code)}`,
        lastModified: lastmod,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  });

  // Payers are indexable as per our implementation of PayerPage metadata
  knowledgeBase.payer_intelligence?.forEach((payer) => {
    dynamicRoutes.push({
      url: `${BASE_URL}/payers/${getPayerSlug(payer.Payer)}`,
      lastModified: lastmod,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  });

  return [...staticRoutes, ...dynamicRoutes];
}
