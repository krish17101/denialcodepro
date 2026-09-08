'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ArrowRight,
  FileWarning,
  Wrench,
} from 'lucide-react';
import { codes, type ClaimCode } from '../lib/codes';

const ITEMS_PER_PAGE = 12;

function getTypeStyle(type: string): {
  badge: string;
  icon: React.ReactNode;
  label: string;
} {
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

export function AllCodesGrid() {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const visible = codes.slice(0, visibleCount);
  const hasMore = codes.length > visibleCount;
  const remaining = codes.length - visible.length;

  return (
    <div className="mt-10">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        All Codes
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((code) => (
          <CodeCard key={code.id} code={code} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <button
            onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
            className="group inline-flex items-center gap-2 rounded-xl bg-navy-800 px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-navy-900 hover:shadow-lg active:scale-[0.98]"
          >
            View More Codes ({remaining} remaining)
            <ChevronDown className="h-4 w-4 transition group-hover:translate-y-0.5" />
          </button>
          <p className="text-xs text-slate-400">
            Showing {visible.length} of {codes.length} codes
          </p>
        </div>
      )}
    </div>
  );
}
