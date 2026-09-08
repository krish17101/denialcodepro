'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, FileWarning, Wrench, Filter, MessageSquare, Send } from 'lucide-react';
import type { ClaimCode } from '../lib/codes';

interface CodeDirectoryProps {
  initialCodes?: ClaimCode[];
}

const ITEMS_PER_PAGE = 12; // Exactly 12 cards visible at a time

export function CodeDirectory({ initialCodes = [] }: CodeDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Denial Code' | 'Adjustment Code'>('All');
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Feedback form states
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'submitting'>('idle');

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

  // Only slice up to visibleCount (starts at 12)
  const displayedCodes = useMemo(() => {
    return filteredCodes.slice(0, visibleCount);
  }, [filteredCodes, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackStatus('submitting');
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '6e91efd0-02f2-4740-b3a8-8cfd52c3719b',
          subject: 'New Feedback from DenialCodePro',
          email: feedbackEmail,
          message: feedbackMessage,
        }),
      });

      if (response.ok) {
        setFeedbackStatus('success');
        setFeedbackEmail('');
        setFeedbackMessage('');
      } else {
        setFeedbackStatus('idle');
        alert('Something went wrong. Please email us directly at denialcodepro@gmail.com');
      }
    } catch {
      setFeedbackStatus('idle');
      alert('Network error. Please email us directly at denialcodepro@gmail.com');
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
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

      {/* Results Info */}
      <div className="flex items-center justify-between px-1 text-xs font-medium text-slate-500">
        <span>
          Showing <strong className="text-slate-800">{displayedCodes.length}</strong> of{' '}
          <strong className="text-slate-800">{filteredCodes.length}</strong> codes
        </span>
        {filteredCodes.length === 0 && (
          <span className="text-rose-500 font-semibold">No matching codes found</span>
        )}
      </div>

      {/* Exactly 12 Card Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {displayedCodes.map((code) => (
          <Link
            key={code.id}
            href={`/code/${encodeURIComponent(code.id)}`}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-navy-500 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-lg bg-slate-900 px-3 py-1 text-xs font-bold tracking-wide text-white transition group-hover:bg-navy-700">
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
              <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-slate-600">
                {code.problem}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
              <span className="font-medium text-slate-400 truncate max-w-[180px]" title={code.group}>
                {code.group}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-navy-600 transition group-hover:translate-x-1">
                View Solution <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Codes Button (Loads next 12) */}
      {visibleCount < filteredCodes.length && (
        <div className="mt-10 text-center">
          <button
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-slate-800 hover:shadow-md active:scale-95"
          >
            View More Codes ({filteredCodes.length - visibleCount} remaining)
          </button>
        </div>
      )}

      {/* Feedback Section (Positioned after code directory and before footer) */}
      <div className="mt-20 rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-navy-600 font-semibold text-sm">
            <MessageSquare className="h-4 w-4" /> Send Us Your Feedback
          </div>
          <h3 className="mt-2 text-xl font-bold text-slate-900">Have a suggestion or missing code?</h3>
          <p className="mt-1 text-xs text-slate-600">
            Drop us a note! Your feedback goes straight to <span className="font-semibold text-slate-800">denialcodepro@gmail.com</span>.
          </p>
        </div>

        {feedbackStatus === 'success' ? (
          <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
            Thank you! Your feedback has been sent successfully.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="mt-6 space-y-4 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email Address</label>
              <input
                type="email"
                required
                value={feedbackEmail}
                onChange={(e) => setFeedbackEmail(e.target.value)}
                placeholder="billingspecialist@hospital.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-navy-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback or Code Request</label>
              <textarea
                required
                rows={3}
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Let us know what you think or what code features you need..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 focus:border-navy-500 focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={feedbackStatus === 'submitting'}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              {feedbackStatus === 'submitting' ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}