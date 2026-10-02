import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ChevronRight, Home } from 'lucide-react';
import { getDenialWorkflowBySlug } from '../../../lib/v3/search';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  // Phase 1: no data — return a generic title.
  // Phase 2+: resolve the workflow and generate specific metadata.
  return {
    title: `Denial Guide: ${params.slug} — DenialCodePro`,
    description:
      'Step-by-step denial resolution guide for U.S. medical billers.',
    robots: { index: false }, // noindex until real content is published
  };
}

/**
 * /denial/[slug] — Denial resolution workflow page.
 *
 * Phase 1 state: no workflow data is loaded.
 * The page renders an honest "coming soon" state.
 * The full 13-section layout is scaffolded below in comments
 * so it is ready for Phase 2 data connection.
 *
 * IMPORTANT: Do not populate any section with invented billing guidance.
 */
export default function DenialPage({ params }: Props) {
  const workflow = getDenialWorkflowBySlug(params.slug);

  // If we ever have data and the slug genuinely doesn't exist, 404.
  // In Phase 1, workflow is always null so we show the coming-soon state.
  if (workflow === null) {
    return <DenialComingSoon slug={params.slug} />;
  }

  // ── Phase 2+: render full workflow ────────────────────────────────────────
  // (unreachable in Phase 1)
  notFound();
}

// ---------------------------------------------------------------------------
// Phase 1 placeholder — honest, non-indexable
// ---------------------------------------------------------------------------

function DenialComingSoon({ slug }: { slug: string }) {
  const displaySlug = decodeURIComponent(slug).toUpperCase();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
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

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
          Denial Guide: {displaySlug}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Claim Adjustment Reason Code resolution workflow
        </p>
      </div>

      {/* Coming-soon notice */}
      <div className="mt-6 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div>
          <p className="font-semibold text-amber-900">
            This guide is being researched.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
            Each denial-resolution guide on DenialCodePro is built from
            official CMS, X12, and MAC sources and reviewed before publishing.
            This guide has not yet been completed. We will not publish guidance
            we cannot verify.
          </p>
        </div>
      </div>

      {/* Planned content structure — visible to editors, honest to users */}
      <div className="mt-8">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Planned content for this guide
        </h2>
        <ol className="mt-4 space-y-2">
          {PLANNED_SECTIONS.map((section, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-400">
                {i + 1}
              </span>
              {section}
            </li>
          ))}
        </ol>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/denial-codes"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Browse denial codes
        </Link>
        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Our research methodology
        </Link>
      </div>
    </main>
  );
}

const PLANNED_SECTIONS = [
  'What happened?',
  'Practical diagnosis',
  'First checks',
  'Claim fields to inspect',
  'Likely causes',
  'Correction or resubmission',
  'Reprocessing, reconsideration, or appeal',
  'Evidence checklist',
  'Wrong-fix warnings',
  'Prevention',
  'Applicable Medicare/MAC guidance',
  'Applicable commercial-payer guidance',
  'Sources and verification information',
];
