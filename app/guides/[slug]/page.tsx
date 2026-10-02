import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { getGuideBySlug } from '../../../lib/v3/search';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Guide: ${params.slug} — DenialCodePro`,
    description: 'Denial resolution workflow guide for U.S. medical billers.',
    robots: { index: false },
  };
}

export default function GuidePage({ params }: Props) {
  const guide = getGuideBySlug(params.slug);
  const displaySlug = decodeURIComponent(params.slug);

  if (guide === null) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
            {displaySlug}
          </h1>
          <p className="mt-2 text-sm text-slate-500">Denial resolution guide</p>
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed text-amber-800">
            This guide is being researched and will be published once verified.
          </p>
        </div>

        <div className="mt-6">
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
          >
            Browse all guides
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    );
  }

  return null;
}
