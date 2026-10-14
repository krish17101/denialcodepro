'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyTextButtonProps {
  text: string;
  buttonLabel?: string;
}

export function CopyTextButton({ text, buttonLabel = 'Copy Letter Template' }: CopyTextButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
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
    <button
      onClick={handleCopy}
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
        copied
          ? 'bg-emerald-600 text-white'
          : 'bg-white text-navy-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50'
      }`}
      aria-label={copied ? 'Copied template to clipboard' : 'Copy template to clipboard'}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-white" />
          Copied to Clipboard!
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 text-slate-500" />
          {buttonLabel}
        </>
      )}
    </button>
  );
}
