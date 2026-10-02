import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '../components/v3/SearchResults';

export const metadata: Metadata = {
  title: 'Search — DenialCodePro',
  description:
    'Search denial codes, remark codes, denial combinations, or describe the problem in plain English.',
  robots: {
    index: false, // Do not index arbitrary search queries
  },
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = (searchParams.q ?? '').trim();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy-800">
          {query ? (
            <>
              Search results for{' '}
              <span className="text-navy-600">
                &ldquo;{query}&rdquo;
              </span>
            </>
          ) : (
            'Search'
          )}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Denial codes · Remark codes · Denial combinations
        </p>
      </div>

      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults query={query} />
      </Suspense>
    </main>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading results">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
        />
      ))}
    </div>
  );
}
