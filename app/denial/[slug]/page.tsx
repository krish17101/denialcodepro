import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home, CheckCircle2, AlertTriangle, ShieldAlert, FileText, Info } from 'lucide-react';
import { getDenialWorkflowBySlug } from '../../../lib/v3/search';
import { getDenialTitle } from '../../../lib/v3/knowledge/data';
import { EventTracker } from '../../components/v3/EventTracker';

interface Props {
  params: { slug: string };
}


export function generateMetadata({ params }: Props): Metadata {
  const workflow = getDenialWorkflowBySlug(params.slug);
  if (!workflow) {
    return {
      title: 'Not Found',
      robots: { index: false },
    };
  }

  const codePair = getDenialTitle(workflow);

  return {
    title: `Denial Guide: ${codePair} — DenialCodePro`,
    description: workflow.practical_diagnosis || workflow.code_meaning,
    robots: {
      index: workflow.publication.indexable,
      follow: true,
    },
  };
}

export default function DenialPage({ params }: Props) {
  const workflow = getDenialWorkflowBySlug(params.slug);

  if (!workflow) {
    notFound();
  }

  const codePair = getDenialTitle(workflow);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <EventTracker eventName="denial_page_opened" eventParams={{ slug: params.slug }} />
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
          Denial Guides
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-navy-700">{codePair}</span>
      </nav>

      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
          {codePair}
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-700">
          {workflow.code_meaning}
        </p>
      </div>

      <div className="mt-8 space-y-8">
        
        {/* Understand */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <Info className="h-5 w-5 text-sky-500" />
            Why this happened
          </h2>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-sm text-slate-600 leading-relaxed">
            {workflow.practical_diagnosis && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Practical Diagnosis</h3>
                <p>{workflow.practical_diagnosis}</p>
              </div>
            )}
            {workflow.likely_root_causes && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Likely Root Causes</h3>
                <p>{workflow.likely_root_causes}</p>
              </div>
            )}
          </div>
        </section>

        {/* Check */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            What to check
          </h2>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-sm text-slate-600 leading-relaxed">
            {workflow.first_60_second_checks && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">First 60-Second Checks</h3>
                <p>{workflow.first_60_second_checks}</p>
              </div>
            )}
            {workflow.claim_fields_to_inspect && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Claim Fields to Inspect</h3>
                <p>{workflow.claim_fields_to_inspect}</p>
              </div>
            )}
          </div>
        </section>

        {/* Act */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Next action
          </h2>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-sm text-slate-600 leading-relaxed">
            {workflow.action_type && (
              <div className="inline-flex rounded-lg bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 mb-2">
                Action: {workflow.action_type}
              </div>
            )}
            {workflow.correction_path && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Correction Path</h3>
                <p>{workflow.correction_path}</p>
              </div>
            )}
            {workflow.appeal_path && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Appeal Path</h3>
                <p>{workflow.appeal_path}</p>
              </div>
            )}
            {workflow.wrong_fix_warning && (
              <div className="mt-4 flex items-start gap-3 rounded-lg bg-rose-50 p-4 text-rose-800">
                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold mb-1">Wrong-Fix Warning</h4>
                  <p>{workflow.wrong_fix_warning}</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Prove */}
        <section>
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            Evidence & Scope
          </h2>
          <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-sm text-slate-600 leading-relaxed">
            {workflow.evidence_package && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Evidence Package</h3>
                <p>{workflow.evidence_package}</p>
              </div>
            )}
            {workflow.medicare_mac_branch && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Medicare / MAC Guidance</h3>
                <p>{workflow.medicare_mac_branch}</p>
              </div>
            )}
            {workflow.commercial_payer_branch && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Commercial Payer Guidance</h3>
                <p>{workflow.commercial_payer_branch}</p>
              </div>
            )}
          </div>
        </section>

        {/* Prevent */}
        {workflow.prevention_control && (
          <section>
            <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-teal-500" />
              Prevention
            </h2>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-sm text-slate-600 leading-relaxed">
              <p>{workflow.prevention_control}</p>
            </div>
          </section>
        )}

      </div>

      <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
        <p>Source Evidence: {workflow.source_evidence}</p>
        <p>Last Verified: {workflow.last_verified}</p>
      </div>
    </main>
  );
}
