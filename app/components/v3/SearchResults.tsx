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

  // ── Index is empty (Phase 1) ───────────────────────────────────────────────
  if (response.indexEmpty) {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold text-amber-900">
              Denial guides are being built.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
              We searched for{' '}
              <strong className="font-semibold">&ldquo;{query}&rdquo;</strong>{' '}
              but the denial-resolution knowledge base has not yet been
              published. Each guide is researched and verified before it goes
              live. Check back soon, or{' '}
              <Link
                href="/about"
                className="font-medium text-amber-900 underline underline-offset-2"
              >
                learn more about how we build content
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            While you wait
          </h2>
          <ul className="mt-4 space-y-3">
            <SuggestionLink
              href="/methodology"
              label="Read our research methodology"
            />
            <SuggestionLink
              href="/sources"
              label="Browse our source list"
            />
            <SuggestionLink
              href="/denial-codes"
              label="Browse denial codes (CARC)"
            />
            <SuggestionLink
              href="/remark-codes"
              label="Browse remark codes (RARC)"
            />
          </ul>
        </div>
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
      <p className="text-sm text-slate-500">
        {response.results.length}{' '}
        {response.results.length === 1 ? 'result' : 'results'} for{' '}
        <strong>&ldquo;{query}&rdquo;</strong>
      </p>
      {response.results.map((result) => (
        <Link
          key={result.slug}
          href={result.href}
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
