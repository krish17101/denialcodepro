'use client';

/**
 * SearchResults — renders the outcome of a search query.
 *
 * Phase 1 state: the knowledge-base index is empty.
 * This component honestly surfaces that state rather than fabricating results.
 *
 * The component is a Client Component so it can later be extended
 * with live/debounced search without routing changes.
 */

import { search } from '../../../lib/v3/search';
import { AlertCircle, SearchX, Search } from 'lucide-react';
import Link from 'next/link';
import { EventTracker } from './EventTracker';

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const response = search({ raw: query });

  // ── No query entered ──────────────────────────────────────────────────────
  if (!query) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <Search className="h-12 w-12 text-slate-300" />
        <p className="mt-4 text-lg font-semibold text-navy-800">
          Enter a denial code or problem to search
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Examples: CO-16, N382, CO-16 N382, &ldquo;units exceed maximum&rdquo;
        </p>
      </div>
    );
  }


  // ── No match found ────────────────────────────────────────────────────────
  if (response.noMatch) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
        <SearchX className="h-12 w-12 text-slate-300" />
        <p className="mt-4 text-lg font-semibold text-navy-800">No results found</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No match for <strong>&ldquo;{query}&rdquo;</strong>. Check the code
          or try different search terms.
        </p>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      <EventTracker eventName="search_submitted" eventParams={{ search_term: query, result_count: response.results.length }} />
      <p className="text-sm text-slate-500">
        {response.results.length}{' '}
        {response.results.length === 1 ? 'result' : 'results'} for{' '}
        <strong>&ldquo;{query}&rdquo;</strong>
      </p>
      {response.results.map((result) => (
        <Link
          key={result.slug}
          href={result.href}
          onClick={() => {
            if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
              (window as any).gtag('event', 'search_result_clicked', { search_term: query, result_url: result.href });
            }
          }}
          className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-navy-300 hover:shadow-md"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-navy-800">
              {result.title}
            </span>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500 capitalize">
              {result.kind}
            </span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            {result.summary}
          </p>
        </Link>
      ))}
    </div>
  );
}

function SuggestionLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-900"
      >
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-navy-400" />
        {label}
      </Link>
    </li>
  );
}
