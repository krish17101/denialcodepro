import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { getSources } from '../../lib/v3/search';
import { EventTracker } from '../components/v3/EventTracker';

export const metadata: Metadata = {
  title: 'Sources & References — DenialCodePro',
  description:
    'Official sources used to build and verify denial-resolution content on DenialCodePro, including CMS, X12, and MAC publications.',
  alternates: { canonical: '/sources' },
};

export default function SourcesPage() {
  const sources = getSources();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <EventTracker eventName="source_opened" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
          Sources &amp; References
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
          Every piece of content on DenialCodePro is sourced from official
          publications. We document what we used, where it came from, and when
          it was retrieved.
        </p>
      </div>

      <div className="space-y-4">
        {sources.map((source) => (
          <div
            key={source['Source ID']}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-500 mb-2">
                  {source.Authority}
                </span>
                <h3 className="text-sm font-bold text-navy-800">
                  {source['Source ID']}
                </h3>
              </div>
              {source['URL/Reference'] && source['URL/Reference'].startsWith('http') && (
                <a
                  href={source['URL/Reference']}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800"
                  aria-label={`Visit source (opens in new tab)`}
                >
                  Visit source
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              <strong className="text-slate-800 font-medium">Use:</strong> {source.Use}
            </p>
            {source['URL/Reference'] && !source['URL/Reference'].startsWith('http') && (
              <p className="mt-1 text-xs text-slate-500 font-mono">
                Ref: {source['URL/Reference']}
              </p>
            )}
            <p className="mt-3 text-xs text-slate-400">
              Verified: {source.Verification}
            </p>
          </div>
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
