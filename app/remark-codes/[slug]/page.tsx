import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Info, Search } from 'lucide-react';
import { getRarcBySlug } from '../../../lib/v3/search';
import { knowledgeBase, getDenialSlug } from '../../../lib/v3/knowledge/data';
import { EventTracker } from '../../components/v3/EventTracker';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const rarc = getRarcBySlug(params.slug);
  if (!rarc) return { title: 'Not Found', robots: { index: false } };

  return {
    title: `Remark Code ${rarc.code} — DenialCodePro`,
    description: rarc.meaning,
    robots: {
      index: rarc.publication.indexable,
      follow: true,
    },
  };
}

export default function RemarkCodePage({ params }: Props) {
  const rarc = getRarcBySlug(params.slug);

  if (!rarc) {
    notFound();
  }

  // Find related denial fingerprints that have workflow available
  const relatedGuides = knowledgeBase.denial_fingerprints?.filter(
    (df) => df.rarc === rarc.code && df.publication.workflow_available
  ) || [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <EventTracker eventName="rarc_page_opened" eventParams={{ rarc: rarc.code }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-navy-700">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <Link href="/remark-codes" className="hover:text-navy-700">
          Remark Codes
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-navy-700">RARC {rarc.code}</span>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-lg bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-200">
          RARC • {rarc.type} • {rarc.status}
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
          Remark Code {rarc.code}
        </h1>
        
        {rarc.type === 'Alert' || rarc.type === 'Informational' ? (
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-indigo-50 p-4 text-indigo-800">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Informational Code</p>
              <p className="text-sm mt-1">This code provides additional context but is not a denial reason itself. It must be read alongside the primary Claim Adjustment Reason Code (CARC).</p>
            </div>
          </div>
        ) : null}

        <div className="mt-6 rounded-xl bg-slate-50 p-6 border border-slate-100">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Original Editorial Meaning</h2>
          <p className="text-lg text-slate-800 font-medium leading-relaxed">{rarc.meaning}</p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {rarc.operational_signal && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Operational Signal</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{rarc.operational_signal}</p>
          </section>
        )}
        
        {rarc.medicare_scope && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Medicare / Payer Scope</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{rarc.medicare_scope}</p>
          </section>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-navy-800 mb-4">Known Related Guides</h2>
        <p className="text-sm text-slate-500 mb-4">
          Never infer a universal pairing. Remark codes explain a CARC, but the exact pairing is determined by the specific ERA and payer rules. Below are researched scenarios involving RARC {rarc.code}.
        </p>

        {relatedGuides.length > 0 ? (
          <div className="grid gap-4">
            {relatedGuides.map(guide => {
              const codePair = guide.group_code ? `${guide.group_code}-${guide.carc} ${guide.rarc}` : `CARC ${guide.carc} RARC ${guide.rarc}`;
              return (
                <Link 
                  key={guide.record_id}
                  href={`/denial/${getDenialSlug(guide)}`}
                  className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-navy-300 hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-navy-800">{codePair}</span>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">Denial Guide</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{guide.practical_diagnosis || guide.code_meaning}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <p className="text-sm text-slate-500">No researched guides currently published for this RARC.</p>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>Source Basis: {rarc.source_basis}</p>
        <p>Verified: {rarc.verified}</p>
      </div>
    </main>
  );
}
