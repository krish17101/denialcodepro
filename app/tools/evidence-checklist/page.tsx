import { pageSeo } from '../../../lib/public/page-seo';
import { EvidenceChecklist } from './tool';
export const metadata = pageSeo("/tools/evidence-checklist", "Medical claim denial evidence checklist", "Build a checklist for a rejected or denied medical claim. Identify the response, the payer rule and any missing records before choosing what to do next.");
export default function EvidenceChecklistPage() {
  return <main id="main-content" tabIndex={-1} className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <h1 className="text-3xl font-bold text-navy-800">Check the evidence before choosing a next step</h1>
    <p className="mt-4 max-w-3xl text-slate-600">This original investigation checklist helps organize what you know and what is missing. It does not determine coverage, select billing codes, calculate deadlines, or establish patient liability.</p>
    <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Do not enter patient information. Choose from the options provided; no claim details are needed. Its recommendations are not a payer policy; verify the applicable requirements before acting.</p>
    <EvidenceChecklist />
    <section className="mt-8 text-sm text-slate-600"><h2 className="font-semibold text-navy-800">How to use the result</h2><p className="mt-2">Keep claim-specific records in your approved billing environment. Review uncertainty with the payer or an appropriate billing specialist. No result guarantees payment or a successful appeal.</p></section>
  </main>;
}
