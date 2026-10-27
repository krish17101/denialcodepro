'use client';
import { useState } from 'react';
import { buildEvidenceChecklist, initialEvidenceState, type EvidenceState } from '../../../lib/v3/evidence-checklist';

export function EvidenceChecklist() {
  const [state, setState] = useState<EvidenceState>(initialEvidenceState);
  const [result, setResult] = useState<string[] | null>(null);
  const change = (update: Partial<EvidenceState>) => { setState(s => ({ ...s, ...update })); setResult(null); };
  const selectClass = 'mt-2 block w-full rounded-lg border border-slate-400 bg-white p-3 text-slate-900';
  return <div className="mt-8 grid gap-6 md:grid-cols-2">
    <form onSubmit={e => { e.preventDefault(); setResult(buildEvidenceChecklist(state)); }} className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 print:hidden">
      <label className="block font-medium" htmlFor="evidence-stage">Response type<select id="evidence-stage" className={selectClass} value={state.stage} onChange={e => change({ stage: e.target.value as EvidenceState['stage'] })}><option value="unknown">Not established</option><option value="front">Front-end response / rejection</option><option value="adjudicated">Adjudicated claim / remittance</option></select></label>
      <label className="block font-medium" htmlFor="evidence-scope">Applicable payer, product, and requirement<select id="evidence-scope" className={selectClass} value={state.scope} onChange={e => change({ scope: e.target.value as EvidenceState['scope'] })}><option value="unknown">Missing or uncertain</option><option value="known">Identified for this claim</option></select></label>
      <label className="block font-medium" htmlFor="evidence-finding">Comparison with the source record<select id="evidence-finding" className={selectClass} value={state.finding} onChange={e => change({ finding: e.target.value as EvidenceState['finding'] })}><option value="unknown">Not compared or conflicting evidence</option><option value="discrepancy">Documented data discrepancy</option><option value="accurate">Reported data appears accurate</option></select></label>
      <button className="rounded-lg bg-navy-800 px-4 py-3 font-semibold text-white" type="submit">Build checklist</button>{' '}
      <button className="rounded-lg border border-slate-300 px-4 py-3" type="button" onClick={() => { setState(initialEvidenceState); setResult(null); }}>Reset</button>
    </form>
    <section aria-live="polite" aria-atomic="true" className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-navy-800">Your investigation checklist</h2>
      {result ? <><ol className="mt-4 list-decimal space-y-4 pl-5 text-slate-700">{result.map(step => <li key={step}>{step}</li>)}</ol><button type="button" className="mt-5 rounded-lg border border-slate-300 px-4 py-2 print:hidden" onClick={() => window.print()}>Print checklist</button></> : <p className="mt-4 text-slate-600">Choose your answers and build a checklist. Unknown is a valid answer. Changing an answer clears the previous result.</p>}
    </section>
  </div>;
}
