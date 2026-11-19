import Link from 'next/link';
import { publicGuides } from '../../../lib/public/guides';
import { codeReference, searchGuides } from '../../../lib/public/search';
export function SearchResults({query}:{query:string}) {
 const ref = codeReference(query);
 const results = searchGuides(query);
 const fallback = results.length === 0;
 return <section aria-labelledby="results-heading">
  <h2 id="results-heading" className="text-2xl font-bold text-navy-800">{!query ? 'Browse the available guides' : ref ? `Look up ${query.trim()} on the remittance` : fallback ? 'No matching guide found' : `Guides related to “${query}”`}</h2>
  <p className="mb-5 mt-3 text-sm leading-relaxed text-slate-600">{ref ? 'Start with the official entry. The guides below are starting points based on your situation, not an interpretation of that code.' : fallback && query ? 'We do not have a guide matching that search. These starting points may help you work out what to check next.' : 'Search covers the original guides published here. A matching topic does not establish which rule applies to your claim.'}</p>
  {ref && <div className="mb-6 rounded-xl border border-slate-200 p-5">
    <p>On the X12 list, find <strong>{ref.id}</strong> in the code column and read any usage notes and dates for that entry. Match it to the affected claim or service line on your notice.</p>
    <a className="mt-3 inline-block font-semibold text-navy-700 underline" href={ref.url} referrerPolicy="no-referrer">Open X12’s {ref.source} list</a>
  </div>}
  {fallback && query && <h3 className="mb-3 font-semibold text-navy-800">Suggested starting points</h3>}
  <ul className="space-y-4">{(fallback ? publicGuides : results).map(g=><li key={g.slug} className="rounded-xl border border-slate-200 bg-white p-5"><Link className="font-bold text-navy-800 underline" href={`/guides/${g.slug}`}>{g.title}</Link><p className="mt-2 text-slate-600">{g.summary}</p></li>)}</ul>
  <p className="mt-6 text-slate-600">Not sure where to start? <Link href="/tools/evidence-checklist" className="font-semibold text-navy-700 underline">Build an evidence checklist</Link>.</p>
 </section>;
}
