import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle, ChevronRight, Home } from 'lucide-react';
import { getRarcBySlug } from '../../../lib/v3/search';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Remark Code ${params.slug.toUpperCase()} — DenialCodePro`,
    description: `Official description for RARC ${params.slug.toUpperCase()} and related denial workflows.`,
    robots: { index: false },
  };
}

/**
 * /remark-codes/[slug] — RARC detail page.
 *
 * Phase 1: no data loaded. Renders honest placeholder.
 * Phase 2+: display official CMS description, ALERT vs. REASON classification,
 *           and link to denial workflows where this RARC appears.
 *
 * IMPORTANT: ALERT-category RARCs must NEVER be described as denial reasons.
 */
export default function RemarkCodePage({ params }: Props) {
  const rarc = getRarcBySlug(params.slug);
  const displaySlug = decodeURIComponent(params.slug).toUpperCase();

  if (rarc === null) {
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
          <Link href="/remark-codes" className="hover:text-navy-700">
            Remark Codes
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-medium text-navy-700">{displaySlug}</span>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <span className="inline-flex rounded-lg bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200">
            RARC
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
            Remark Code {displaySlug}
          </h1>
        </div>

        <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm leading-relaxed text-amber-800">
            The detailed page for remark code{' '}
            <strong>{displaySlug}</strong> is being researched and verified.
            Official RARC descriptions sourced from CMS will appear here once
            reviewed. Note: some RARC codes are informational-only (ALERT
            category) and do not indicate a denial reason.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/remark-codes"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
          >
            Browse all remark codes
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

  return null;
}
