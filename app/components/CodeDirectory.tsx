'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, FileWarning, Wrench, Filter } from 'lucide-react';
import type { ClaimCode } from '../lib/codes';

interface CodeDirectoryProps {
  initialCodes?: ClaimCode[];
}

const ITEMS_PER_PAGE = 24;

export function CodeDirectory({ initialCodes = [] }: CodeDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Denial Code' | 'Adjustment Code'>('All');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const uniqueGroups = useMemo(() => {
    const groups = new Set(initialCodes.map((c) => c.group));
    return ['All', ...Array.from(groups)];
  }, [initialCodes]);

  const filteredCodes = useMemo(() => {
    return initialCodes.filter((code) => {
      const matchesSearch =
        code.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.group.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' || code.type === selectedType;
      const matchesGroup = selectedGroup === 'All' || code.group === selectedGroup;

      return matchesSearch && matchesType && matchesGroup;
    });
  }, [initialCodes, searchQuery, selectedType, selectedGroup]);

  const displayedCodes = useMemo(() => {
    return filteredCodes.slice(0, visibleCount);
  }, [filteredCodes, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by code (e.g. CO-16, PR-1) or keyword..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition focus:border-navy-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-500/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
              {(['All', 'Denial Code', 'Adjustment Code'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className={`rounded-lg px-3 py-2 transition ${
                    selectedType === type
                      ? 'bg-white text-navy-800 shadow-sm'
                      : 'hover:text-navy-800'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-xs font-semibold text-slate-700 transition focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/20"
              >
                <option value="All">All Groups</option>
                {uniqueGroups.filter(g => g !== 'All').map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{displayedCodes.length}</strong> of{' '}
          <strong className="text-slate-800">{filteredCodes.length}</strong> codes
        </span>
        {filteredCodes.length === 0 && (
          <span className="text-rose-500 font-semibold">No matching codes found</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayedCodes.map((code) => (
          <Link
            key={code.id}
            href={`/code/${encodeURIComponent(code.id)}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-400 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-lg bg-navy-800 px-2.5 py-1 text-xs font-bold tracking-wide text-white transition group-hover:bg-navy-900">
                  {code.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    code.type === 'Denial Code'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {code.type === 'Denial Code' ? (
                    <FileWarning className="h-3 w-3" />
                  ) : (
                    <Wrench className="h-3 w-3" />
                  )}
                  {code.type}
                </span>
              </div>
              <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                {code.problem}
              </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="font-medium text-slate-400 truncate max-w-[180px]" title={code.group}>
                {code.group}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-navy-700 transition group-hover:translate-x-1">
                View Solution <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < filteredCodes.length && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-800 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-navy-900 hover:shadow active:scale-95"
          >
            View More Codes ({filteredCodes.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}