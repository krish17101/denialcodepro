import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Remark Codes (RARC) Directory — DenialCodePro',
  description:
    'Remittance Advice Remark Codes (RARC) used by payers to provide additional explanation on claim payments and adjustments.',
  alternates: { canonical: '/remark-codes' },
};

export default function RemarkCodesIndexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200">
          RARC — Remittance Advice Remark Codes
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
          Remark Codes Directory
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Remittance Advice Remark Codes (RARCs) provide additional explanation
          on claim payments and adjustments. They appear alongside Claim
          Adjustment Reason Codes (CARCs) on the remittance advice. Some RARCs
          are informational only (ALERT category) and do not indicate a denial
          reason.
        </p>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-semibold text-amber-900">Content coming soon</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
            The RARC directory is being built from official CMS sources. Each
            code will include its official description, category (ALERT vs.
            REASON), and links to relevant denial workflows. We publish entries
            only after review.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/denial-codes"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Browse denial codes (CARC)
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/sources"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Official sources
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
