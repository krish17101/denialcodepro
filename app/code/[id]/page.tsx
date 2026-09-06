import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  AlertTriangle,
  ListChecks,
  Tag,
  Layers,
  FileWarning,
  Wrench,
  ArrowRight,
  Search,
  ShieldAlert,
  Home,
  ChevronRight,
} from 'lucide-react';
import {
  codes,
  getCodeById,
  getRelatedCodes,
  type ClaimCode,
} from '../../lib/codes';
import { CopyEhrNote } from '../../components/CopyEhrNote';

export function generateStaticParams() {
  return codes.map((c) => ({ id: encodeURIComponent(c.id) }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const code = getCodeById(decodeURIComponent(params.id));
  if (!code) return { title: 'Code Not Found | DenialCode Pro' };

  const title = `${code.id} Denial Code: Root Cause, Resolution & EHR Note`;
  const description = `${code.problem} Category: ${code.group}. Find the root cause, step-by-step resolution, EHR note, and preventative action for denial code ${code.id}.`;

  return {
    title,
    description,
    alternates: { canonical: `/code/${encodeURIComponent(code.id)}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/code/${encodeURIComponent(code.id)}`,
    },
    twitter: {
      card: 'summary',
      title: `${code.id} Denial Code | DenialCode Pro`,
      description: code.problem,
    },
    keywords: [
      code.id,
      `${code.id} denial code`,
      `${code.id} root cause`,
      `${code.id} resolution`,
      `${code.id} medical billing`,
      code.group,
      code.type,
      'medical billing denial',
      'claim adjustment reason code',
      'CARC',
      'EHR note',
    ],
  };
}

export default function CodeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const code = getCodeById(decodeURIComponent(params.id));
  if (!code) notFound();

  const hasEnrichment = !!code.rootCause && !!code.resolutionSteps;
  const howToJson = buildHowToSchema(code);
  const faqJson = buildFaqSchema(code);
  const related = getRelatedCodes(code.id, 4);

  const categoryHref =
    code.type === 'Denial Code'
      ? '/denial-codes'
      : '/adjustment-codes';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: howToJson }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqJson }}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-navy-700"
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <Link href={categoryHref} className="hover:text-navy-700">
            {code.type === 'Denial Code' ? 'Denial Codes' : 'Adjustment Codes'}
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-medium text-navy-700">{code.id}</span>
        </nav>

        {/* Header card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center rounded-lg bg-navy-800 px-3 py-1.5 text-base font-bold tracking-wide text-white">
              {code.id}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                code.type === 'Denial Code'
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {code.type === 'Denial Code' ? (
                <FileWarning className="h-3.5 w-3.5" />
              ) : (
                <Wrench className="h-3.5 w-3.5" />
              )}
              {code.type}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200">
              <Layers className="h-3.5 w-3.5" />
              {code.group}
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
            Code {code.id}
          </h1>
        </div>

        {/* Problem card */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-white">
              <Tag className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-navy-800">
              Problem Description
            </h2>
          </div>
          <div className="px-6 py-6">
            <p className="text-base leading-relaxed text-slate-700">
              {code.problem}
              <span className="sr-only">
                [Protected by DenialCode Pro - Watermelon Protocol]
              </span>
            </p>
          </div>
        </div>

        {/* AdSense placeholder */}
        <div className="mt-6 flex h-28 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100 text-sm font-medium tracking-wide text-slate-400">
          {/* Google AdSense B2B Healthcare Ad Unit */}
        </div>

        {/* Enriched content or fallback */}
        {hasEnrichment ? (
          <>
            {/* Root Cause */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-700 text-white">
                  <Search className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-navy-800">Root Cause</h2>
              </div>
              <div className="px-6 py-6">
                <p className="text-base leading-relaxed text-slate-700">
                  {code.rootCause}
                </p>
              </div>
            </div>

            {/* Resolution Steps */}
            <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-emerald-200 bg-emerald-100/60 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                  <ListChecks className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold text-emerald-900">
                  Resolution Steps
                </h2>
              </div>
              <div className="px-6 py-6">
                <ol className="space-y-4">
                  {code.resolutionSteps!.map((step, i) => (
                    <li key={i} className="flex gap-3.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 text-base leading-relaxed text-emerald-900/90">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* EHR Note */}
            {code.ehrNote && (
              <div className="mt-6">
                <CopyEhrNote note={code.ehrNote} />
              </div>
            )}

            {/* Preventative Action */}
            {code.preventativeAction && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-6 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-amber-900">
                    Preventative Action
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-amber-900/80">
                    {code.preventativeAction}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Fallback: standard solution */
          <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-emerald-200 bg-emerald-100/60 px-6 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                <ListChecks className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-emerald-900">
                Actionable Fix &mdash; Solution Steps
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="whitespace-pre-line text-base leading-relaxed text-emerald-900/90">
                {code.solution}
              </p>
            </div>
          </div>
        )}

        {/* Related codes */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
              Related Codes in {code.group}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((c) => (
                <Link
                  key={c.id}
                  href={`/code/${encodeURIComponent(c.id)}`}
                  className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-navy-700">
                      {c.id}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-navy-500" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {c.problem}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div className="mt-8 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p>
            This directory provides reference information only and does not
            constitute official legal, medical, or financial billing advice.
            Always consult the payer&apos;s official remittance advice and
            current coding guidelines.
          </p>
        </div>
      </main>
    </>
  );
}

function buildHowToSchema(code: ClaimCode): string {
  if (!code.resolutionSteps || code.resolutionSteps.length === 0) {
    return JSON.stringify({});
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to resolve denial code ${code.id}`,
    description: code.problem,
    step: code.resolutionSteps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: `Step ${i + 1}`,
      text: step,
    })),
  };
  return JSON.stringify(schema);
}

function buildFaqSchema(code: ClaimCode): string {
  const questions = [
    {
      '@type': 'Question',
      name: `What does code ${code.id} mean?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: code.problem,
      },
    },
    {
      '@type': 'Question',
      name: `How do I fix or resolve code ${code.id}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: code.resolutionSteps
          ? code.resolutionSteps.join(' ')
          : code.solution,
      },
    },
  ];

  if (code.rootCause) {
    questions.push({
      '@type': 'Question',
      name: `What is the root cause of denial code ${code.id}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: code.rootCause,
      },
    });
  }

  if (code.preventativeAction) {
    questions.push({
      '@type': 'Question',
      name: `How can I prevent denial code ${code.id} in the future?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: code.preventativeAction,
      },
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions,
  };
  return JSON.stringify(schema);
}
