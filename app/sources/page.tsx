import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sources & References — DenialCodePro',
  description:
    'Official sources used to build and verify denial-resolution content on DenialCodePro, including CMS, X12, and MAC publications.',
  alternates: { canonical: '/sources' },
};

const SOURCES: Array<{
  category: string;
  items: Array<{ title: string; description: string; url?: string }>;
}> = [
  {
    category: 'CMS — Centers for Medicare & Medicaid Services',
    items: [
      {
        title: 'Claim Adjustment Reason Codes (CARC)',
        description:
          'Official X12/CMS-maintained list of codes explaining why a claim was adjusted.',
        url: 'https://x12.org/codes/claim-adjustment-reason-codes',
      },
      {
        title: 'Remittance Advice Remark Codes (RARC)',
        description:
          'Official CMS list of remark codes used to provide additional information on remittance advice.',
        url: 'https://x12.org/codes/remittance-advice-remark-codes',
      },
      {
        title: 'Medicare Claims Processing Manual',
        description:
          'CMS Internet-Only Manual (IOM) Publication 100-04 covering claims processing procedures.',
        url: 'https://www.cms.gov/regulations-and-guidance/guidance/manuals/internet-only-manuals-ioms-items/cms018912',
      },
    ],
  },
  {
    category: 'X12 — ASC X12 Standards Body',
    items: [
      {
        title: 'X12 CARC/RARC Code Lists',
        description:
          'The authoritative source for CARC and RARC code definitions, maintained by the ASC X12 committee.',
        url: 'https://x12.org/codes',
      },
      {
        title: '835 Health Care Claim Payment/Advice',
        description:
          'The X12 transaction set governing electronic remittance advice, where CARC and RARC codes appear.',
      },
    ],
  },
  {
    category: 'Medicare Administrative Contractors (MACs)',
    items: [
      {
        title: 'MAC Provider Manuals and LCD/NCD Policies',
        description:
          'Local Coverage Determinations and provider education materials published by regional MACs.',
      },
      {
        title: 'MAC Appeals Processes',
        description:
          'Jurisdiction-specific guidance on redetermination, reconsideration, and ALJ hearing processes.',
      },
    ],
  },
  {
    category: 'Commercial Payer Policies',
    items: [
      {
        title: 'Payer Provider Manuals',
        description:
          'Network-specific policies and billing guides published by individual commercial insurance payers.',
      },
      {
        title: 'EOB and Remittance Documentation',
        description:
          'Explanation of Benefits and ERA documentation from individual payers used to corroborate denial reasons.',
      },
    ],
  },
];

export default function SourcesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
          Sources &amp; References
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          Every piece of content on DenialCodePro is sourced from official
          publications. We document what we used, where it came from, and when
          it was retrieved. This page lists the primary source categories.
          Individual guides include their specific citations.
        </p>
      </div>

      <div className="space-y-8">
        {SOURCES.map((group) => (
          <section key={group.category}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {group.category}
            </h2>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-bold text-navy-800">
                      {item.title}
                    </h3>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800"
                        aria-label={`Open ${item.title} (opens in new tab)`}
                      >
                        Visit source
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/methodology"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Our research methodology
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/disclaimer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
        >
          Medical &amp; billing disclaimer
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
