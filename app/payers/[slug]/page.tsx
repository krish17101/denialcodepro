import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, Building2, Calendar, FileText } from 'lucide-react';
import { getPayerBySlug } from '../../../lib/v3/search';
import { EventTracker } from '../../components/v3/EventTracker';

interface Props {
  params: { slug: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const payer = getPayerBySlug(params.slug);
  if (!payer) return { title: 'Not Found', robots: { index: false } };

  return {
    title: `Payer: ${payer.Payer} — DenialCodePro`,
    description: `Billing guidance and operational rules for ${payer.Payer}.`,
    robots: { index: true, follow: true },
  };
}

export default function PayerPage({ params }: Props) {
  const payer = getPayerBySlug(params.slug);

  if (!payer) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <EventTracker eventName="payer_page_opened" eventParams={{ payer: payer.Payer }} />
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/" className="inline-flex items-center gap-1 hover:text-navy-700">
          <Home className="h-3.5 w-3.5" />
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-navy-700">{payer.Payer}</span>
      </nav>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
              {payer.Payer}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {payer['Market/Scope']}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-800 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-500" />
            Important Operational Rule
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
            {payer['Important Operational Rule']}
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-navy-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            Timely Filing & Correction
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Key Timely-Filing Signal</h3>
              <p className="text-sm text-slate-600">{payer['Key Timely-Filing Signal']}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Correction Route</h3>
              <p className="text-sm text-slate-600">{payer['Correction Route']}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">Appeal/Reconsideration Route</h3>
              <p className="text-sm text-slate-600">{payer['Appeal/Reconsideration Route']}</p>
            </div>
          </div>
        </section>

        {(payer['COB Signal'] || payer['Authorization/Clinical Signal']) && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-navy-800 mb-4">Specific Scenarios</h2>
            <div className="space-y-4">
              {payer['COB Signal'] && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Coordination of Benefits (COB)</h3>
                  <p className="text-sm text-slate-600">{payer['COB Signal']}</p>
                </div>
              )}
              {payer['Authorization/Clinical Signal'] && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Authorization / Clinical</h3>
                  <p className="text-sm text-slate-600">{payer['Authorization/Clinical Signal']}</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p className="mb-2 font-semibold">Note: Do not generalize these rules to all products, all states, or all plans for this payer. Always verify with specific plan documents.</p>
        <p>Source: {payer.Source}</p>
        <p>Verified: {payer.Verified}</p>
      </div>
    </main>
  );
}
