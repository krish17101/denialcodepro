'use client';

import { useState } from 'react';
import { Clipboard, Check } from 'lucide-react';

export function CopyEhrNote({ note }: { note: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = note;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // ignore
      }
      document.body.removeChild(ta);
    }
  };

  return (
    <div className="rounded-xl border border-navy-200 bg-navy-50 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-navy-600">
            EHR Documentation Note
          </p>
          <p className="mt-2 truncate text-sm text-slate-600">{note}</p>
        </div>
        <button
          onClick={handleCopy}
          className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-navy-800 text-white hover:bg-navy-900'
          }`}
          aria-label={copied ? 'EHR note copied to clipboard' : 'Copy EHR note'}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" />
              Copy EHR Note
            </>
          )}
        </button>
      </div>
    </div>
  );
}
