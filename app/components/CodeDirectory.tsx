'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, FileWarning, Wrench, SearchX, ChevronDown } from 'lucide-react';
import { codes, type ClaimCode } from '../lib/codes';

export type CategoryFilter =
  | 'All'
  | 'Contractual Obligation'
  | 'General Adjustment'
  | 'Patient Responsibility';

const categories: CategoryFilter[] = [
  'All',
  'Contractual Obligation',
  'General Adjustment',
  'Patient Responsibility',
];

const FREQUENT_IDS = ['CO-16', 'CO-4', 'CO-18', '97', 'CO-45', '1'];

const PAGE_SIZE = 24;

function getTypeStyle(type: string): { badge: string; icon: React.ReactNode; label: string } {
  if (type.startsWith('Denial')) {
    return {
      badge: 'bg-rose-50 text-rose-600',
      icon: <FileWarning className="h-3 w-3" />,
      label: 'Denial Code',
    };
  }
  if (type.startsWith('Adjustment')) {
    return {
      badge: 'bg-emerald-50 text-emerald-700',
      icon: <Wrench className="h-3 w-3" />,
      label: 'Adjustment Code',
    };
  }
  return {
    badge: 'bg-slate-100 text-slate-600',
    icon: <Wrench className="h-3 w-3" />,
    label: 'Other',
  };
}

function CodeCard({ code }: { code: ClaimCode }) {
  const ts = getTypeStyle(code.type);
  return (
    <Link
      href={`/code/${encodeURIComponent(code.id)}`}
      className="group flex flex-col select-none rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-md bg-navy-50 px-2.5 py-1 text-sm font-bold tracking-wide text-navy-700 ring-1 ring-inset ring-navy-200">
          {code.id}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${ts.badge}`}
        >
          {ts.icon}
          {ts.label}
        </span>
      </div>
      <span className="mt-3 text-xs font-medium text-slate-400">
        {code.group}
      </span>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {code.problem}
      </p>
      <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-navy-700">
        View Solution
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function CodeDirectory({
  autoFocus = false,
  initialCategory = 'All',
  showFilterPills = true,
  typeFilter,
}: {
  autoFocus?: boolean;
  initialCategory?: CategoryFilter;
  showFilterPills?: boolean;
  typeFilter?: 'Denial Code' | 'Adjustment Code';
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>(initialCategory);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (autoFocus) inputRef.current?.focus();
  // }, [autoFocus]);

  const isDefaultState =
    !query.trim() && activeCategory === 'All' && !typeFilter;

  const frequentCodes = useMemo(() => {
    return FREQUENT_IDS.map((id) => codes.find((c) => c.id === id)).filter(
      (c): c is ClaimCode => c !== undefined
    );
  }, []);

  const filtered = useMemo(() => {
    let list: ClaimCode[] = codes;

    if (typeFilter) {
      list = list.filter((c) => c.type === typeFilter);
    }

    if (activeCategory !== 'All') {
      list = list.filter((c) => c.group === activeCategory);
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.problem.toLowerCase().includes(q) ||
        c.solution.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [query, activeCategory, typeFilter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const handleCategoryChange = (cat: CategoryFilter) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {/* Category filter pills */}
      {showFilterPills && (
        <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                activeCategory === cat
                  ? 'bg-navy-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:text-navy-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Search bar */}
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 sm:left-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          placeholder="Search by code, problem, or solution..."
          aria-label="Search codes"
          className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-base text-slate-900 shadow-md outline-none ring-navy-400 transition focus:shadow-lg focus:ring-2 sm:py-4 sm:pl-14"
        />
      </div>

      {/* Default state: Frequently Searched */}
      {isDefaultState ? (
        <div className="mt-10">
          <h3 className="mb-6 text-center text-lg font-bold tracking-tight text-navy-800">
            Frequently Searched
          </h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {frequentCodes.map((code) => (
              <CodeCard key={code.id} code={code} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="mt-5 text-center text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'code' : 'codes'} found
            {query && (
              <>
                {' '}
                for &quot;<span className="font-medium">{query}</span>&quot;
              </>
            )}
          </p>

          {/* Grid or empty state */}
          {filtered.length === 0 ? (
            <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center">
              <SearchX className="h-12 w-12 text-slate-300" />
              <p className="mt-4 text-lg font-semibold text-navy-800">
                No codes found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Check your spelling or try a different search term.
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((code) => (
                  <CodeCard key={code.id} code={code} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"
                  >
                    Load More
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
