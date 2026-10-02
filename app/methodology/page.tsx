import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Research Methodology — DenialCodePro',
  description:
    'How DenialCodePro researches, verifies, and publishes denial-resolution guides for U.S. medical billers.',
  alternates: { canonical: '/methodology' },
};

const PRINCIPLES = [
  {
    title: 'Official sources only',
    description:
      'Every CARC and RARC code definition comes from the X12/CMS-maintained code list. We do not paraphrase or reinterpret official definitions without disclosure.',
  },
  {
    title: 'ALERT codes are not denial reasons',
    description:
      'Remittance Advice Remark Codes classified as ALERT are informational only. We never describe an ALERT-category RARC as a cause of denial without supporting evidence from the primary adjudication reason (CARC).',
  },
  {
    title: 'No invented payer rules',
    description:
      'We do not infer payer-specific rules, appeal deadlines, or reimbursement guarantees from code wording alone. Payer-specific guidance is sourced from published provider manuals and verified policies.',
  },
  {
    title: 'CARC/RARC pairings require evidence',
    description:
      'We do not create denial workflows for CARC/RARC combinations we have not verified as occurring in practice. Similar-sounding codes are not treated as equivalents.',
  },
  {
    title: 'Sources cited on every guide',
    description:
      'Each denial-resolution guide lists the specific publications and retrieval dates used in its research. The guide is updated when the underlying source changes.',
  },
  {
    title: 'No medical or legal advice',
    description:
      'Content is reference information to assist billing professionals. It is not a substitute for professional coding, legal, or medical billing advice. We disclose this clearly on every guide.',
  },
  {
    title: 'Content reviewed before publishing',
    description:
      'Guides pass an internal review before publication. Unverified or incomplete guides are not published, even if the planned structure is ready.',
  },
];

const WORKFLOW_STEPS = [
  'Identify the denial code combination (CARC + zero or more RARCs) from a real remittance advice scenario.',
  'Look up the official X12/CMS description of each code in the current code set.',
  'Research the denial in official MAC provider education, CMS manuals, and payer policy documents.',
  'Draft the resolution workflow using only findings that can be attributed to a specific source.',
  'Cross-reference the draft against at least two independent official sources where possible.',
  'Document every source with a URL and retrieval date.',
  'Internal review — flag any claim that lacks a verifiable citation.',
  'Publish the guide with sources visible to the reader.',
];

export default function MethodologyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
          Research Methodology
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          DenialCodePro is built for medical billing professionals who need
          accurate, actionable, and verifiable information. This page explains
          how we research and publish content.
        </p>
      </div>

      {/* Core principles */}
      <section>
        <h2 className="text-xl font-bold text-navy-800">Core principles</h2>
        <div className="mt-5 space-y-4">
          {PRINCIPLES.map((p) => (
            <div
              key={p.title}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <div>
                <h3 className="text-sm font-bold text-navy-800">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Research workflow */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-navy-800">
          How each guide is built
        </h2>
        <ol className="mt-5 space-y-3">
          {WORKFLOW_STEPS.map((step, i) => (
            <li
              key={i}
              className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-sm font-bold text-white">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-relaxed text-slate-600">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* What we do not do */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-navy-800">
          What we do not do
        </h2>
        <ul className="mt-5 space-y-2">
          {[
            'We do not use AI-generated denial explanations without expert review.',
            'We do not guarantee specific appeal outcomes or reimbursement timelines.',
            'We do not publish guides that are incomplete or unverified.',
            'We do not treat remark codes as primary denial reasons without supporting evidence.',
            'We do not process, store, or analyze any patient health information (PHI).',
          ].map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/sources"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Browse our sources
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/disclaimer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Medical disclaimer
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
