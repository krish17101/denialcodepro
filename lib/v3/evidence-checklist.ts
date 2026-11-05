/** Original editorial investigation aid; not payer rules or code-set content. */
export type EvidenceState = {
  stage: 'unknown' | 'front' | 'adjudicated';
  scope: 'unknown' | 'known';
  finding: 'unknown' | 'discrepancy' | 'accurate';
};
export const initialEvidenceState: EvidenceState = { stage: 'unknown', scope: 'unknown', finding: 'unknown' };
export function buildEvidenceChecklist(state: EvidenceState) {
  const steps: string[] = [];
  steps.push(state.stage === 'unknown'
    ? 'Identify the response type and the affected claim or service line before selecting a submission or review route.'
    : state.stage === 'front'
      ? 'Retrieve the front-end response and transmission record. Establish what was accepted; do not assume this was a decision on the claim’s merits.'
      : 'Retrieve the remittance, accompanying messages, affected adjustment or line, and any decision notice.');
  if (state.scope === 'unknown') steps.push('Establish the payer, plan/product, relevant setting, and dated requirement. Ask the payer to identify the disputed fact and controlling rule.');
  if (state.finding === 'discrepancy') {
    steps.push('Compare original, transmitted, and received data with the documented source record. Preserve the evidence supporting the discrepancy and any proposed change.');
    steps.push(state.scope === 'known' && state.stage !== 'unknown'
      ? 'Confirm the payer’s correction method and claim linkage before submitting supported changes. A correction, replacement, and new claim are not interchangeable.'
      : 'Resolve the missing response or payer requirements before choosing a submission method. A discrepancy alone does not establish that method.');
  } else if (state.finding === 'accurate') {
    steps.push('Obtain the precise decision rationale and compare its scope and effective period with the reported facts. Keep contradictory evidence visible.');
    steps.push('Establish whether a processing inquiry, reconsideration, or appeal is available to your role and what each route requires. Do not repeatedly send an unchanged claim.');
  } else steps.push('Reconcile the source record, outbound claim, and payer response. Do not choose a correction or dispute branch while those facts remain unknown or conflicting.');
  steps.push('Confirm the applicable deadline, triggering event, counting method, and supported exceptions promptly. Do not assume an inquiry pauses a deadline.');
  steps.push('Retain the rule, contact reference, submission contents and receipt evidence in your approved systems. Review the next response; submission does not guarantee payment.');
  return steps;
}
