'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

/**
 * Homepage search box.
 * Navigates to /search?q=<query> on submit.
 * Does NOT perform inline search — all search logic lives in /search.
 */
export function SearchBox() {
  const [value, setValue] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="Search denial codes">
      <div className="relative flex items-center">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400 sm:left-5"
        />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search a denial code, remark code, denial message, or problem"
          aria-label="Search a denial code, remark code, denial message, or problem"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-32 text-base text-slate-900 shadow-xl outline-none ring-navy-400 transition placeholder:text-slate-400 focus:border-navy-400 focus:ring-2 sm:pl-14 sm:pr-36"
        />
        <button
          type="submit"
          className="absolute right-2 inline-flex items-center gap-1.5 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-900 active:scale-95 sm:px-5"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>
    </form>
  );
}
