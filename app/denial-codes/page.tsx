import type { Metadata } from 'next';
import Link from 'next/link';
import { FileWarning, AlertCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Denial Codes (CARC) Directory — DenialCodePro',
  description:
    'Claim Adjustment Reason Codes (CARC) used by payers to explain why a medical claim was adjusted or denied.',
  alternates: { canonical: '/denial-codes' },
};

export default function DenialCodesIndexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200">
          <FileWarning className="h-3.5 w-3.5" />
          CARC — Claim Adjustment Reason Codes
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
          Denial Codes Directory
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Claim Adjustment Reason Codes (CARCs) explain why a claim was
          adjusted or denied. They appear on your remittance advice (ERA/EOB)
          alongside any applicable Remittance Advice Remark Codes (RARCs).
        </p>
      </div>

      {/* About CARCs */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-navy-800">About CARC codes</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
          <p>
            CARCs are maintained by the ASC X12 committee and adopted by CMS
            for use in the 835 Health Care Claim Payment/Advice transaction.
            They are the primary indicator of why a claim was adjusted.
          </p>
          <p>
            CARC codes are grouped by the party responsible for the adjustment:
          </p>
          <ul className="ml-4 space-y-1.5">
            <li>
              <strong className="text-navy-700">CO</strong> — Contractual
              Obligation (provider is responsible under a contract)
            </li>
            <li>
              <strong className="text-navy-700">CR</strong> — Correction and
              Reversal
            </li>
            <li>
              <strong className="text-navy-700">OA</strong> — Other Adjustment
            </li>
            <li>
              <strong className="text-navy-700">PI</strong> — Payer Initiated
              Reductions
            </li>
            <li>
              <strong className="text-navy-700">PR</strong> — Patient
              Responsibility
            </li>
          </ul>
        </div>
      </section>

      {/* Content status */}
      <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-semibold text-amber-900">
            Denial-resolution guides are being built
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
            Individual CARC pages with denial-resolution workflows are being
            researched and verified against official CMS and X12 sources.
            Each guide will appear here as it is completed. We will not publish
            unverified content.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/remark-codes"
          className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Also browse
            </span>
            <p className="mt-1 text-sm font-bold text-navy-800">
              Remark Codes (RARC)
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Additional explanation codes on the remittance advice
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-navy-500" />
        </Link>

        <Link
          href="/guides"
          className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Resolution workflows
            </span>
            <p className="mt-1 text-sm font-bold text-navy-800">
              Denial Guides
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Step-by-step guides for common denial combinations
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-navy-500" />
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/sources"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Official sources
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Research methodology
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
