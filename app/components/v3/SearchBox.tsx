'use client';
import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { isCodeQuery, searchGuides, suggestedTopics } from '../../../lib/public/search';

/** Suggestions are matched only against the published original guides. */
export function SearchBox({ initialQuery = '' }: { initialQuery?: string }) {
  const [value, setValue] = useState(initialQuery);
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const privacyId = `${id}-search-privacy`;
  const q = value.trim();
  const suggestions = q.length >= 2 ? searchGuides(q).slice(0, 3) : [];
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm sm:p-6">
    <form action="/search" method="get" role="search" aria-label="Search billing guides" onSubmit={e => { if (!q) { e.preventDefault(); inputRef.current?.focus(); } }}>
      <label htmlFor={id} className="mb-3 block font-semibold text-navy-800">What do you need help with?</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input id={id} ref={inputRef} type="search" name="q" value={value} onChange={e => setValue(e.target.value)} placeholder="Try corrected claim or appeal deadline" autoComplete="off" spellCheck={false} aria-describedby={privacyId} maxLength={180} className="min-w-0 flex-1 rounded-lg border border-slate-400 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500" />
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-800 px-5 py-3 font-semibold text-white hover:bg-navy-900"><Search aria-hidden="true" className="h-4 w-4" />Search</button>
      </div>
      <p id={privacyId} className="mt-3 text-sm leading-relaxed text-slate-600">Use general billing topics only. Do not enter patient names, member numbers, or other patient information. Submitted searches appear in the page URL.</p>
    </form>
    {!q && <div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-sm text-slate-600">Try:</span>{suggestedTopics.map(topic => <Link key={topic} href={`/search?q=${encodeURIComponent(topic)}`} className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-navy-800 hover:bg-slate-200">{topic}</Link>)}</div>}
    <p role="status" className="mt-4 text-sm text-slate-600">{q.length < 2 ? 'Search the guides available on this website.' : isCodeQuery(q) ? 'Code-specific lookup is not available in this preview. Try a billing topic instead.' : suggestions.length ? `${suggestions.length} suggested ${suggestions.length === 1 ? 'guide' : 'guides'}` : 'No matching guide yet. Try correction, rejection, or deadline.'}</p>
    {suggestions.length > 0 && <ul aria-label="Suggested guides" className="mt-2 divide-y divide-slate-200">{suggestions.map(g => <li key={g.slug}><Link href={`/guides/${g.slug}`} className="block rounded-lg py-3 text-sm font-semibold text-navy-800 underline underline-offset-4 hover:text-emerald-800">{g.title}</Link></li>)}</ul>}
  </div>;
}
