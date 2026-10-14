import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  Home,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  FileText,
  Info,
  Clock,
  ExternalLink,
  AlertOctagon,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { getDenialWorkflowBySlug } from '../../../lib/v3/search';
import { getDenialTitle } from '../../../lib/v3/knowledge/data';
import { EventTracker } from '../../components/v3/EventTracker';
import { CopyTextButton } from '../../components/v3/CopyTextButton';
import { ComprehensiveDenialGuide } from '../../../lib/v3/knowledge/types';

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

  const isCo29 = workflow.record_id === 'DF-037' || workflow.structured_guide?.guide_id === 'GUIDE-CO-29';
  const pageTitle = isCo29
    ? 'CO-29 — Denial Resolution Guide — DenialCodePro'
    : `Denial Guide: ${getDenialTitle(workflow)} — DenialCodePro`;
  const pageDescription = isCo29
    ? 'Step-by-step filing-deadline investigation, evidence collection, payer-specific guidance, and resolution options.'
    : (workflow.practical_diagnosis || workflow.code_meaning);

  return {
    title: pageTitle,
    description: pageDescription,
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
  const guide = workflow.structured_guide;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <EventTracker eventName="denial_page_opened" eventParams={{ slug: params.slug }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-slate-500">
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

      {/* Structured Guide Render (CO-29 Comprehensive Workflow) */}
      {guide ? (
        <RenderComprehensiveGuide guide={guide} workflow={workflow} codePair={codePair} />
      ) : (
        /* Fallback Baseline Render for standard fingerprints */
        <RenderBaselineGuide workflow={workflow} codePair={codePair} />
      )}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Comprehensive Guide Renderer (CO-29 Full Operational Guide)
// ---------------------------------------------------------------------------

function RenderComprehensiveGuide({
  guide,
  workflow,
  codePair,
}: {
  guide: ComprehensiveDenialGuide;
  workflow: any;
  codePair: string;
}) {
  return (
    <div className="space-y-10">
      {/* 1. Header & Architectural Overview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex rounded-lg bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-800 ring-1 ring-inset ring-navy-200">
            CARC {guide.code_explanation.carc_code} • Group Code {guide.code_explanation.group_code}
          </span>
          <span className="inline-flex rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            Complete Resolution Guide
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
          {guide.guide_title}
        </h1>
        <p className="mt-2 text-base leading-relaxed text-slate-600 sm:text-lg">
          {guide.guide_subtitle}
        </p>

        {/* Quick Answer: 3 Critical Questions */}
        <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50/60 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-navy-800" />
            <h2 className="text-base font-bold text-navy-900">
              {guide.quick_answer?.title || 'Quick Answer: 3 Critical Questions to Resolve CO-29'}
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            Before writing off charges or contacting the payer, establish the facts using this three-part diagnostic framework:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(guide.quick_answer?.questions || [
              {
                question_number: 1,
                question: 'Which deadline applies to this payer, plan, provider, and claim type?',
                summary: 'Determine the governing rule: Original Medicare FFS (1 calendar year from DOS / Through date), commercial participating contracts (commonly 90–180 days), out-of-network rules, or verified secondary COB terms.',
              },
              {
                question_number: 2,
                question: 'What receipt date does the payer recognize, and what evidence supports it?',
                summary: 'Audit EDI 277CA Loop 2200A DTP*050 and the complete STC composite (A1 receipt acknowledgment or A2 adjudication acceptance per payer companion guide), or payer portal receipt logs. Internal PM creation logs alone do not prove payer receipt.',
              },
              {
                question_number: 3,
                question: 'Was the claim late, or is there evidence of timely filing or an applicable exception?',
                summary: 'If accepted timely, dispute with 277CA proof. If untimely, audit for qualifying statutory exceptions (42 CFR § 424.44) or contractual clauses before determining financial disposition.',
              },
            ]).map((q) => (
              <div key={q.question_number} className="rounded-lg border border-sky-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-navy-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-800 text-[10px] font-bold text-white">
                    {q.question_number}
                  </span>
                  <span>Question {q.question_number}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-900">
                  {q.question}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
                  {q.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Accessible Section Jump Links */}
        <nav aria-label="Page sections navigation" className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            <span>Jump to Section</span>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { href: '#initial-records', label: '1. Initial Records' },
              { href: '#investigation', label: '2. Investigation' },
              { href: '#timeline', label: '3. Timeline & Dates' },
              { href: '#decision-outcomes', label: '4. Decision Outcomes' },
              { href: '#resolution-workflows', label: '5. Resolution Workflows' },
              { href: '#medicare-ffs', label: '6. Original Medicare' },
              { href: '#commercial-payers', label: '7. Commercial Payers' },
              { href: '#inquiry-template', label: '8. Inquiry Template' },
              { href: '#warnings', label: '9. Warnings' },
              { href: '#prevention', label: '10. Prevention' },
              { href: '#checklist', label: '11. Final Checklist' },
              { href: '#sources', label: '12. Sources' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200 hover:bg-slate-100 hover:text-navy-900 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-600"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Group Code Meaning & Patient Billing Separation */}
        <div className="mt-6 rounded-xl border border-sky-100 bg-sky-50/50 p-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-900">
            Group Code {guide.code_explanation.group_code} Definition & Patient Billing Scope
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Group Code Meaning:</strong> {guide.code_explanation.group_code_meaning}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>Financial Responsibility Scope:</strong> {guide.code_explanation.patient_billing_scope}
          </p>
        </div>

        {/* What the Code Does & Does NOT Establish */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-5">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              What this code establishes
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
              {guide.code_explanation.what_code_establishes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-5">
            <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
              <AlertOctagon className="h-4 w-4 shrink-0 text-rose-600" />
              What this code does NOT establish
            </div>
            <ul className="mt-3 space-y-2 text-xs text-slate-700 leading-relaxed">
              {guide.code_explanation.what_code_does_not_establish.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 2. Initial Records Checklist */}
      <section id="initial-records" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-indigo-600" />
          1. Initial Records Checklist
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Gather these documents before beginning investigation or filing an inquiry.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guide.initial_records_checklist.map((rec, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="text-sm font-semibold text-navy-800">{rec.record_type}</div>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">{rec.purpose}</p>
              <div className="mt-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Source:</span> {rec.where_to_find}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Ordered Investigation Steps */}
      <section id="investigation" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-sky-600" />
          2. Ordered Investigation Steps
        </h2>
        <div className="mt-4 space-y-4">
          {guide.investigation_steps.map((step) => (
            <div key={step.step_number} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-800 text-xs font-bold text-white">
                  {step.step_number}
                </span>
                <div>
                  <h3 className="text-base font-bold text-navy-800">{step.title}</h3>
                  <p className="text-xs font-medium text-sky-700">{step.milestone}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 sm:pl-10 pl-5 text-sm text-slate-600 leading-relaxed list-disc">
                {step.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
              {step.records_or_fields && step.records_or_fields.length > 0 && (
                <div className="mt-4 sm:ml-10 ml-0 overflow-x-auto rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <table className="min-w-full text-xs text-left text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-800 font-semibold">
                        <th className="pb-1">Field / Element</th>
                        <th className="pb-1">EDI Segment</th>
                        <th className="pb-1">What to Verify</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {step.records_or_fields.map((rf, rfi) => (
                        <tr key={rfi}>
                          <td className="py-1 font-medium text-navy-700">{rf.field}</td>
                          <td className="py-1">{rf.source_or_segment || '—'}</td>
                          <td className="py-1">{rf.what_to_verify}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. Timeline Events & EDI Distinction Notice */}
      <section id="timeline" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-emerald-600" />
          3. Timeline Events & Date Evidence
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {guide.timeline_and_dates.general_rules}
        </p>

        {/* Timeline Table */}
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold">
              <tr>
                <th className="px-4 py-3">Timeline Event</th>
                <th className="px-4 py-3">Field / Source</th>
                <th className="px-4 py-3">Evidence Role</th>
                <th className="px-4 py-3">Operational Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {guide.timeline_and_dates.timeline_events.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-bold text-navy-800">
                    {evt.event_name}
                    {evt.applicable_scope && (
                      <span className="block text-[10px] font-medium text-slate-500 mt-0.5">
                        Scope: {evt.applicable_scope}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono text-[11px] text-slate-700">{evt.field_or_source}</td>
                  <td className="px-4 py-2.5">{evt.evidence_role}</td>
                  <td className="px-4 py-2.5">{evt.significance_notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EDI Distinction Notice: 999 vs 277CA */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Crucial Distinction: 999 Functional Acknowledgment vs. 277CA Claim Acknowledgment
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            {guide.timeline_and_dates.edi_distinction_notice.ack_999_vs_277ca}
          </p>
          <div className="border-t border-amber-200/60 pt-2 text-xs text-amber-900/80 leading-relaxed">
            <strong>Internal Billing Dates:</strong> {guide.timeline_and_dates.edi_distinction_notice.internal_pm_dates_rule}
          </div>
        </div>
      </section>

      {/* 5. Decision Outcomes Matrix */}
      <section id="decision-outcomes" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-teal-600" />
          4. Decision Outcomes Matrix
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {guide.decision_outcomes.map((dec, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-flex rounded bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 uppercase">
                  {dec.outcome_type.replace(/_/g, ' ')}
                </span>
                <h3 className="mt-2 text-base font-bold text-navy-800">{dec.title}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  <strong>Criteria:</strong> {dec.criteria}
                </p>
                <p className="mt-2 text-xs text-navy-800 font-medium leading-relaxed">
                  <strong>Recommended Action:</strong> {dec.recommended_action}
                </p>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-500">
                <strong>Patient Billing:</strong> {dec.patient_billing_rules}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Five Detailed Resolution Scenarios */}
      <section id="resolution-workflows" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <Info className="h-5 w-5 text-sky-600" />
          5. Resolution Workflows by Scenario
        </h2>
        <div className="mt-4 space-y-6">
          {guide.detailed_scenarios.map((scen) => (
            <div key={scen.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-navy-800">{scen.title}</h3>
                <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700">
                  {scen.action_badge || scen.action_type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                <strong>When this occurs:</strong> {scen.trigger_condition}
              </p>

              {/* Resolution steps */}
              <div className="mt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step-by-Step Resolution Action
                </h4>
                <ol className="mt-2 space-y-1.5 pl-5 text-xs text-slate-700 leading-relaxed list-decimal">
                  {scen.resolution_path.map((stp, si) => (
                    <li key={si}>{stp}</li>
                  ))}
                </ol>
              </div>

              {/* Evidence package */}
              <div className="mt-4 rounded-lg bg-slate-50 p-3.5">
                <h4 className="text-xs font-bold text-slate-700">Required Evidence Package:</h4>
                <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc pl-4">
                  {scen.evidence_package.map((ev, evi) => (
                    <li key={evi}>{ev}</li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              {scen.pitfalls_and_warnings && scen.pitfalls_and_warnings.length > 0 && (
                <div className="mt-3 text-xs text-rose-700 bg-rose-50/70 rounded p-2.5 space-y-1">
                  {scen.pitfalls_and_warnings.map((pw, pwi) => (
                    <p key={pwi} className="flex items-start gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-600" />
                      <span>{pw}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Original Medicare FFS Rules & The 4 CMS Exceptions */}
      <section id="medicare-ffs" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-indigo-600" />
          6. Original Medicare Fee-for-Service Rules & The 4 CMS Statutory Exceptions
        </h2>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-navy-800">Standard 1-Year Filing Deadline</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">{guide.medicare_ffs_rules.filing_deadline_rule}</p>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">{guide.medicare_ffs_rules.date_convention_details}</p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4 space-y-2 text-xs text-slate-700">
            <p>
              <strong>Distinction from Medicare Advantage:</strong> {guide.medicare_ffs_rules.distinction_from_medicare_advantage}
            </p>
            <p>
              <strong>Appeal Rights Limitation:</strong> {guide.medicare_ffs_rules.appeal_rights_limitation}
            </p>
            <p>
              <strong>Beneficiary Billing Prohibition:</strong> {guide.medicare_ffs_rules.beneficiary_billing_restriction}
            </p>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-bold text-navy-800 mb-2">
              The Four CMS Statutory Exceptions (42 CFR § 424.44)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {guide.medicare_ffs_rules.exceptions.map((ex) => (
                <div key={ex.exception_number} className="rounded-lg border border-slate-200 p-4">
                  <div className="text-xs font-bold text-indigo-700">
                    Exception #{ex.exception_number}: {ex.name}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 mt-0.5">{ex.authority}</div>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    <strong>Conditions:</strong> {ex.qualifying_conditions}
                  </p>
                  <div className="mt-2 text-[11px] text-slate-600">
                    <strong>Documentation Required:</strong>
                    <ul className="list-disc pl-3 mt-1 space-y-0.5">
                      {ex.documentation_required.map((doc, doci) => (
                        <li key={doci}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Commercial Payer Rules (Cigna Example) */}
      <section id="commercial-payers" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-teal-600" />
          7. Commercial Payer Rules & Scoped Examples
        </h2>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {guide.commercial_payer_rules.general_principles}
          </p>

          <div className="space-y-4">
            {guide.commercial_payer_rules.payers.map((cp, cpi) => (
              <div key={cpi} className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-bold text-navy-800">{cp.payer_name}</span>
                  <span className="text-xs font-semibold text-teal-700">{cp.participation_status}</span>
                </div>
                <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                  <div>
                    <span className="text-slate-500">Claim Type:</span>
                    <div className="font-medium text-slate-800">{cp.claim_type}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Timely Filing Limit:</span>
                    <div className="font-bold text-navy-800">{cp.timely_filing_limit}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Appeals Window:</span>
                    <div className="font-medium text-slate-800">{cp.appeal_limit}</div>
                  </div>
                </div>
                {cp.secondary_claim_rule && (
                  <p className="mt-2 text-xs text-slate-600">
                    <strong>Secondary Claims:</strong> {cp.secondary_claim_rule}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-600">
                  <strong>Exceptions:</strong> {cp.exceptions_summary}
                </p>
                <div className="mt-3 border-t border-slate-200 pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Source: {cp.source_title}</span>
                  <a
                    href={cp.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-navy-700 hover:underline"
                  >
                    View Reference <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Adaptable Payer Inquiry Template */}
      <section id="inquiry-template" className="scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            8. {guide.inquiry_template.title || 'Adaptable Payer Inquiry Letter Template'}
          </h2>
          <CopyTextButton text={guide.inquiry_template.template_body} buttonLabel="Copy Letter Template" />
        </div>
        <p className="text-xs text-slate-600 mb-4">{guide.inquiry_template.context_use_case}</p>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <span className="text-xs font-semibold text-slate-500">Subject Line:</span>
            <div className="font-mono text-xs text-navy-800 mt-0.5">{guide.inquiry_template.subject_line}</div>
          </div>
          <pre className="font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 overflow-x-auto">
            {guide.inquiry_template.template_body}
          </pre>
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-1">Variable Placeholders to Replace:</h4>
            <div className="grid gap-1 sm:grid-cols-2 text-[11px] text-slate-600">
              {guide.inquiry_template.placeholders.map((ph, phi) => (
                <div key={phi}>
                  <code className="text-indigo-600 font-semibold">{ph.token}</code>: {ph.description}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10. Wrong-Fix Warnings */}
      <section id="warnings" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          9. Critical Wrong-Fix Warnings
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guide.wrong_fix_warnings.map((wf, wfi) => (
            <div key={wfi} className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 space-y-2">
              <div className="flex items-start gap-2 font-bold text-rose-900 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <span>Avoid: {wf.action_to_avoid}</span>
              </div>
              <p className="text-xs text-rose-950/90 leading-relaxed">
                <strong>Why it fails:</strong> {wf.why_it_fails}
              </p>
              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white/70 p-2 rounded">
                <strong>Correct action:</strong> {wf.correct_alternative}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Prevention Controls */}
      <section id="prevention" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-emerald-600" />
          10. Prevention Controls & Operational Best Practices
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {guide.prevention_controls.map((pc, pci) => (
            <div key={pci} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold text-navy-800">
                <span>{pc.control_name}</span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {pc.timing}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">{pc.operational_action}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 12. Final Resolution Checklist */}
      <section id="checklist" className="scroll-mt-24">
        <h2 className="text-xl font-bold text-navy-800 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-teal-600" />
          11. Final Resolution Checklist
        </h2>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ul className="space-y-2 text-xs text-slate-700">
            {guide.final_resolution_checklist.map((chk, ci) => (
              <li key={ci} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 text-emerald-600 font-bold">
                  ✓
                </span>
                <span>{chk}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 13. Authoritative Sources & Governance */}
      <div id="sources" className="border-t border-slate-200 pt-6 text-xs text-slate-500 space-y-4 scroll-mt-24">
        <div>
          <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
            Authoritative Regulatory & Payer Sources
          </h3>
          <ul className="space-y-1.5">
            {guide.sources_and_governance.authoritative_sources.map((src, srci) => (
              <li key={srci} className="flex items-center justify-between">
                <span>
                  <strong>{src.authority}:</strong> {src.title} ({src.citation})
                </span>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-navy-700 hover:underline shrink-0 ml-2"
                  >
                    Source <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-[11px] leading-relaxed">
          <strong>Scope & Disclaimer:</strong> {guide.sources_and_governance.scope_limitations}
        </p>
        <p className="text-[11px]">
          Last Verified: {guide.sources_and_governance.last_reviewed_date}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Baseline Guide Renderer (Fallback for Standard Denial Fingerprints)
// ---------------------------------------------------------------------------

function RenderBaselineGuide({ workflow, codePair }: { workflow: any; codePair: string }) {
  return (
    <div>
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
          {codePair}
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-700">{workflow.code_meaning}</p>
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

        {/* Evidence & Scope */}
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

        {/* Prevention */}
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
    </div>
  );
}
