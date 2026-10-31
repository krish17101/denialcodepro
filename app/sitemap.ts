import type { MetadataRoute } from 'next';
import { publicGuides } from '../lib/public/guides';
export default function sitemap():MetadataRoute.Sitemap {
 const paths=['/','/guides','/tools/evidence-checklist','/about','/contact','/methodology','/sources','/privacy-policy','/terms','/disclaimer',...publicGuides.map(g=>`/guides/${g.slug}`)];
 return paths.map(path=>({url:`https://denialcodepro.com${path}`}));
}
