import Link from 'next/link';
import { publicGuides } from '../../../lib/public/guides';
import { isCodeQuery, searchGuides } from '../../../lib/public/search';
export function SearchResults({query}:{query:string}) {
 const results = searchGuides(query);
 const fallback = results.length === 0;
 return <section aria-labelledby="results-heading">
  <h2 id="results-heading" className="text-2xl font-bold text-navy-800">{!query ? 'Browse the available guides' : isCodeQuery(query) ? 'Code lookup is not available yet' : fallback ? 'No matching guide found' : `Guides related to “${query}”`}</h2>
  <p className="mb-5 mt-3 text-sm leading-relaxed text-slate-600">{isCodeQuery(query) ? 'This preview does not include code-specific explanations. The guides below are general starting points, not an interpretation of that code.' : fallback && query ? 'We do not have a guide matching that search. These starting points may help you work out what to check next.' : 'Search covers the original guides published here. A matching topic does not establish which rule applies to your claim.'}</p>
  {fallback && query && <h3 className="mb-3 font-semibold text-navy-800">Suggested starting points</h3>}
  <ul className="space-y-4">{(fallback ? publicGuides : results).map(g=><li key={g.slug} className="rounded-xl border border-slate-200 bg-white p-5"><Link className="font-bold text-navy-800 underline" href={`/guides/${g.slug}`}>{g.title}</Link><p className="mt-2 text-slate-600">{g.summary}</p></li>)}</ul>
  <p className="mt-6 text-slate-600">Not sure where to start? <Link href="/tools/evidence-checklist" className="font-semibold text-navy-700 underline">Build an evidence checklist</Link>.</p>
 </section>;
}
