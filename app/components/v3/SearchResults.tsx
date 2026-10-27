import Link from 'next/link';
import { publicGuides } from '../../../lib/public/guides';
/** Server-rendered search of the explicitly published original guides only. */
export function SearchResults({query}:{query:string}) {
 const terms=query.toLowerCase().split(/\s+/).filter(Boolean);
 const results=terms.length?publicGuides.filter(g=>terms.some(t=>(g.title+' '+g.summary+' '+g.firstCheck).toLowerCase().includes(t))):publicGuides;
 return <section><p className="mb-5 text-sm text-slate-600">Search covers the original investigation guides in this release, not the code-reference library. Do not enter patient information.</p>{results.length?<ul className="space-y-4">{results.map(g=><li key={g.slug} className="rounded-xl border border-slate-200 bg-white p-5"><Link className="font-bold text-navy-800 underline" href={`/guides/${g.slug}`}>{g.title}</Link><p className="mt-2 text-slate-600">{g.summary}</p></li>)}</ul>:<p>No guide matches that topic. <Link href="/guides" className="underline">Browse the available guides</Link> or <Link href="/tools/evidence-checklist" className="underline">start an evidence checklist</Link>.</p>}</section>;
}
