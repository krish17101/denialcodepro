import { ComprehensiveDenialGuide } from '../../types';
import { ValidationIssue } from '../types';

export function validateScopeSensitivity(guide: ComprehensiveDenialGuide): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // =========================================================================
  // 1. Commercial Payer Rules Section Checks
  // =========================================================================
  const commercial = guide.commercial_payer_rules;
  if (commercial) {
    const generalPrinciplesLower = commercial.general_principles.toLowerCase();

    // 1a. Introductory paragraph must be conditional (not blanket replacement claim only)
    const isBlanketReplacement =
      generalPrinciplesLower.includes('must generally submit a replacement claim') &&
      generalPrinciplesLower.includes('rather than an appeal') &&
      !generalPrinciplesLower.includes('depend on the submission facts') &&
      !generalPrinciplesLower.includes('if submitted data was accurate');

    if (isBlanketReplacement) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'COMMERCIAL_RESOLVE_OVERREACH',
        severity: 'FATAL',
        message: 'Commercial general principles assert that all commercial CARC 16 adjustments require a replacement claim rather than an appeal. Must provide conditional paths: data error -> correct and resubmit; payer processing error -> dispute/appeal or review with 837 proof.',
        location: 'commercial_payer_rules.general_principles'
      });
    }

    // 1b. Check each payer card
    commercial.payers.forEach((payer, idx) => {
      const filingLower = payer.timely_filing_limit.toLowerCase();
      const exceptionsLower = payer.exceptions_summary.toLowerCase();

      // Check appeal deadline conflation with corrected claims
      const hasAppealDeadlineConflation =
        ((filingLower.includes('appeal deadline') || filingLower.includes('appeal limit')) &&
         (filingLower.includes('universally') || filingLower.includes('automatically applies')) &&
         !filingLower.includes('do not assume')) ||
        filingLower.includes('corrected claims have the same 180-day deadline as appeals') ||
        filingLower.includes('appeal deadline applies to corrected claims') ||
        filingLower.includes('commercial appeal deadline universally applies');

      if (hasAppealDeadlineConflation) {
        issues.push({
          rule: 'scope-sensitive',
          code: 'DEADLINE_SCOPE_MISMATCH',
          severity: 'FATAL',
          message: `Commercial payer card [${payer.payer_name}] conflates provider appeal deadlines with corrected claim filing deadlines. Appeal windows do not automatically govern corrected claim submissions.`,
          location: `commercial_payer_rules.payers[${idx}].timely_filing_limit`,
          context: { payer: payer.payer_name }
        });
      }

      // Check exceptions: Must not present commercial exceptions as automatic or guaranteed
      const claimsGuaranteedExceptions =
        (exceptionsLower.includes('guaranteed exceptions') ||
         exceptionsLower.includes('exceptions are guaranteed') ||
         exceptionsLower.includes('automatic exceptions')) &&
        !exceptionsLower.includes('not automatic') &&
        !exceptionsLower.includes('not guaranteed');

      if (claimsGuaranteedExceptions) {
        issues.push({
          rule: 'scope-sensitive',
          code: 'COMMERCIAL_EXCEPTIONS_OVERREACH',
          severity: 'FATAL',
          message: `Commercial payer card [${payer.payer_name}] presents exceptions as automatic or guaranteed. Technical outages, clearinghouse translation errors, and COB delays must be framed as extenuating circumstances to document and request discretionary review.`,
          location: `commercial_payer_rules.payers[${idx}].exceptions_summary`,
          context: { payer: payer.payer_name }
        });
      }
    });
  }

  // =========================================================================
  // 2. Original Medicare FFS Unprocessable Scoping Checks
  // =========================================================================
  const medicare = guide.medicare_ffs_rules;
  if (medicare) {
    const appealLimitationLower = medicare.appeal_rights_limitation.toLowerCase();
    const filingDeadlineLower = medicare.filing_deadline_rule.toLowerCase();

    // Check if guide claims ALL CARC 16 adjustments are unprocessable claims without appeal rights
    if (
      guide.code_explanation.carc_code === '16' &&
      (appealLimitationLower.includes('all carc 16 claims lack appeal rights') ||
       appealLimitationLower.includes('every carc 16 denial is unprocessable') ||
       (appealLimitationLower.includes('no appeal rights') &&
        !appealLimitationLower.includes('returned as unprocessable') &&
        !appealLimitationLower.includes('claims that are unprocessable') &&
        !appealLimitationLower.includes('pub. 100-04') &&
        !appealLimitationLower.includes('ma130')))
    ) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'UNPROCESSABLE_SCOPE_OVERREACH',
        severity: 'FATAL',
        message: 'The Medicare FFS appeal rights section equates all CARC 16 adjustments with unprocessable claims lacking appeal rights. Unprocessable claim guidance must be scoped specifically to claims returned as unprocessable under CMS IOM Pub. 100-04 Ch. 1 § 80 (with MA130). Adjudicated claims with CARC 16 maintain initial determination appeal rights under SSA § 1869.',
        location: 'medicare_ffs_rules.appeal_rights_limitation'
      });
    }

    // Check that Medicare FFS filing deadline specifies 1 calendar year
    if (
      !filingDeadlineLower.includes('1 calendar year') &&
      !filingDeadlineLower.includes('one calendar year') &&
      !filingDeadlineLower.includes('12 months') &&
      !filingDeadlineLower.includes('365 days')
    ) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'MEDICARE_DEADLINE_MISSING',
        severity: 'FATAL',
        message: 'Medicare FFS timely filing deadline rule must explicitly state the statutory 1 calendar year (12 months) filing limit under 42 CFR § 424.44.',
        location: 'medicare_ffs_rules.filing_deadline_rule'
      });
    }
  }

  // =========================================================================
  // 3. 835 Remittance vs Clearinghouse Front-End Rejection Checks
  // =========================================================================
  const ediNotice = guide.timeline_and_dates && guide.timeline_and_dates.edi_distinction_notice;
  const guideAllText = JSON.stringify(guide).toLowerCase();

  if (guide.code_explanation.carc_code === '16') {
    const mentionsClearinghouse =
      guideAllText.includes('277ca') ||
      guideAllText.includes('clearinghouse rejection') ||
      guideAllText.includes('gateway rejection');

    if (mentionsClearinghouse) {
      const distinguishesRejection =
        (ediNotice &&
          (ediNotice.ack_999_vs_277ca.toLowerCase().includes('not an 835') ||
           ediNotice.ack_999_vs_277ca.toLowerCase().includes('never be confused') ||
           ediNotice.ack_999_vs_277ca.toLowerCase().includes('prior to ingestion') ||
           ediNotice.ack_999_vs_277ca.toLowerCase().includes('un-ingested'))) ||
        guideAllText.includes('clearly distinguish between two separate events') ||
        guideAllText.includes('adjudicated adjustment reported on an 835');

      if (!distinguishesRejection) {
        issues.push({
          rule: 'scope-sensitive',
          code: 'REJECTION_REMITTANCE_CONFLATION',
          severity: 'FATAL',
          message: 'The guide references clearinghouse 277CA / gateway rejections without clearly distinguishing them from an adjudicated 835 remittance. Front-end rejections occur prior to payer adjudication.',
          location: 'timeline_and_dates.edi_distinction_notice'
        });
      }

      if (
        guideAllText.includes('appeal the 277ca rejection') ||
        guideAllText.includes('appeal a clearinghouse rejection') ||
        guideAllText.includes('appeal the front-end rejection')
      ) {
        issues.push({
          rule: 'scope-sensitive',
          code: 'REJECTION_REMITTANCE_CONFLATION',
          severity: 'FATAL',
          message: 'Guide instructs providers to appeal a clearinghouse rejection. Un-ingested clearinghouse rejections have no payer adjudication record and cannot be appealed; they must be corrected and retransmitted.',
          location: 'investigation_steps_or_scenarios'
        });
      }
    }
  }

  // =========================================================================
  // 4. Group Code CO & Patient Financial Liability Checks
  // =========================================================================
  const groupCode = guide.code_explanation.group_code;
  const patientBillingScope = (guide.code_explanation.patient_billing_scope || '').toLowerCase();

  if (groupCode === 'CO') {
    if (
      patientBillingScope.includes('automatically decides every patient-liability question') ||
      patientBillingScope.includes('universally decides all patient liability') ||
      patientBillingScope.includes('abn is universally required before any patient billing under any payer')
    ) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'GROUP_CODE_LIABILITY_OVERREACH',
        severity: 'FATAL',
        message: 'Group Code CO cannot be asserted as universally determining all patient liability questions or universally requiring an ABN across all payers. Patient liability must be qualified by applicable Medicare statutory rules, executed provider contracts, and payer policies.',
        location: 'code_explanation.patient_billing_scope'
      });
    }

    for (const outcome of guide.decision_outcomes) {
      const outcomeText = (outcome.criteria + ' ' + outcome.recommended_action + ' ' + outcome.patient_billing_rules).toLowerCase();
      if (
        outcomeText.includes('bill patient immediately without qualification') ||
        outcomeText.includes('automatically bill the patient for the balance')
      ) {
        issues.push({
          rule: 'scope-sensitive',
          code: 'GROUP_CODE_LIABILITY_OVERREACH',
          severity: 'FATAL',
          message: `Decision outcome "${outcome.title}" contains an unqualified instruction to bill the patient under Group Code CO.`,
          location: `decision_outcomes[${outcome.outcome_type}]`
        });
      }
    }
  }

  return issues;
}
