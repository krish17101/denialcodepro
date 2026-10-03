import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, FileWarning, Search } from 'lucide-react';
import { getCarcBySlug } from '../../../lib/v3/search';
import { knowledgeBase, getDenialSlug } from '../../../lib/v3/knowledge/data';
import { EventTracker } from '../../components/v3/EventTracker';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const carc = getCarcBySlug(params.slug);
  if (!carc) return { title: 'Not Found', robots: { index: false } };

  return {
    title: `Denial Code ${carc.code} — DenialCodePro`,
    description: carc.meaning,
    robots: {
      index: carc.publication.indexable,
      follow: true,
    },
  };
}

export default function DenialCodePage({ params }: Props) {
  const carc = getCarcBySlug(params.slug);

  if (!carc) {
    notFound();
  }

  // Find related denial fingerprints that have workflow available
  const relatedGuides = knowledgeBase.denial_fingerprints?.filter(
    (df) => df.carc === carc.code && df.publication.workflow_available
  ) || [];

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <EventTracker eventName="carc_page_opened" eventParams={{ carc: carc.code }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-navy-700">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <Link href="/denial-codes" className="hover:text-navy-700">
          Denial Codes
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-navy-700">CARC {carc.code}</span>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <span className="inline-flex rounded-lg bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200">
          CARC • {carc.status}
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
          Denial Code {carc.code}
        </h1>
        <div className="mt-6 rounded-xl bg-slate-50 p-6 border border-slate-100">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">Original Editorial Meaning</h2>
          <p className="text-lg text-slate-800 font-medium leading-relaxed">{carc.meaning}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-navy-800 mb-4">Resolution Guides</h2>
        
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
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-start gap-4">
            <FileWarning className="h-5 w-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-slate-900">No researched guides available</p>
              <p className="text-sm text-slate-600 mt-1">We have not yet published a verified denial resolution workflow for this CARC. A detailed operational guide will be added once it has been fully researched against official payer and MAC sources.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>Source Basis: {carc.source_basis}</p>
        <p>Verified: {carc.verified}</p>
        {!carc.publication.indexable && <p className="mt-2 text-amber-600 font-semibold">Internal QA Note: This record is reference-only and not indexable.</p>}
      </div>
    </main>
  );
}
