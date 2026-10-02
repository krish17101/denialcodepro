import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Denial Guides — DenialCodePro',
  description:
    'Step-by-step denial resolution workflows for common CARC/RARC combinations used in U.S. medical billing.',
  alternates: { canonical: '/guides' },
};

export default function GuidesIndexPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
          <BookOpen className="h-3.5 w-3.5" />
          Denial Resolution Workflows
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
          Denial Guides
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
          Practical, step-by-step resolution guides for common denial code
          combinations. Each guide is built from official CMS, X12, and MAC
          sources and walks through diagnosis, correction, appeal, and
          prevention.
        </p>
      </div>

      <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-semibold text-amber-900">Guides are being researched</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
            Each denial guide is carefully built and verified before publishing.
            We prioritise the most frequently occurring denials first. Guides
            will appear here as they are completed.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/denial-codes"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Browse denial codes
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Our methodology
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
