import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ChevronRight, Home } from 'lucide-react';
import { getCarcBySlug } from '../../../lib/v3/search';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Denial Code ${params.slug.toUpperCase()} — DenialCodePro`,
    description: `Official description and denial-resolution workflow for CARC ${params.slug.toUpperCase()}.`,
    robots: { index: false }, // noindex until approved content is published
  };
}

/**
 * /denial-codes/[slug] — CARC detail page.
 *
 * Phase 1: no CARC data loaded. Renders an honest placeholder.
 * Phase 2+: will resolve the CARC, display official description,
 *           link to related denial workflows, and list known RARC pairings.
 */
export default function DenialCodePage({ params }: Props) {
  const carc = getCarcBySlug(params.slug);
  const displaySlug = decodeURIComponent(params.slug).toUpperCase();

  if (carc === null) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-sm text-slate-500"
        >
          <Link href="/" className="inline-flex items-center gap-1 hover:text-navy-700">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <Link href="/denial-codes" className="hover:text-navy-700">
            Denial Codes
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-medium text-navy-700">{displaySlug}</span>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200">
            CARC
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
            Denial Code {displaySlug}
          </h1>
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed text-amber-800">
            The detailed page for <strong>{displaySlug}</strong> is being
            researched and verified. Official CARC descriptions and
            denial-resolution workflows will appear here once the content
            has been reviewed against CMS and X12 sources.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/denial-codes"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
          >
            Browse all denial codes
          </Link>
          <Link
            href="/sources"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
          >
            Official sources
          </Link>
        </div>
      </main>
    );
  }

  // Phase 2+: render full CARC detail
  return null;
}
