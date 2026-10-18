/**
 * Rule: scope-sensitive
 * Verifies commercial payer rules, Original Medicare FFS unprocessable claim
 * scoping, 835 vs clearinghouse distinction, and Group Code CO patient billing rules.
 */

function validateScopeSensitivity(guide) {
  const issues = [];

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
      const scopeLower = payer.participation_status.toLowerCase();
      const filingLower = payer.timely_filing_limit.toLowerCase();
      const appealLower = payer.appeal_limit.toLowerCase();
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

  // =========================================================================
  // 5. CARC 18 Group Code Validation (OA Standard vs CO Exception)
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '18') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();
    const explanationText = (
      (guide.code_explanation.group_code_meaning || '') + ' ' +
      (guide.code_explanation.patient_billing_scope || '')
    ).toLowerCase();

    // Must not state or imply that CO is the universal, standard, or exclusive group code
    const assertsUniversalCO =
      rawGuideText.includes('carc 18 is universally assigned group code co') ||
      rawGuideText.includes('carc 18 always uses group code co') ||
      rawGuideText.includes('group code co is the standard group code for carc 18') ||
      rawGuideText.includes('universal group code co for carc 18') ||
      (guide.code_explanation.group_code === 'CO' && !explanationText.includes('oa') && !explanationText.includes('other adjustment'));

    if (assertsUniversalCO) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'CARC_18_GROUP_CODE_OVERREACH',
        severity: 'FATAL',
        message: 'CARC 18 is officially designated by X12 for use with Group Code OA ("Use only with Group Code OA except where state workers\' compensation regulations require CO"). The guide must not assert Group Code CO as the universal or standard group code, and must teach OA as the X12 standard with CO as the workers\' comp/remittance exception.',
        location: 'code_explanation.group_code'
      });
    }

    // Must not make a blanket claim of zero patient liability merely because an adjustment uses OA or CO
    // (per X12 RFI 2814, Group Code OA does not provide clear direction on adjustment liability on its own)
    const assertsBlanketZeroLiability =
      rawGuideText.includes('oa carries zero patient liability') ||
      rawGuideText.includes('group code oa carries zero patient liability') ||
      rawGuideText.includes('adjustment that carries zero patient liability') ||
      rawGuideText.includes('oa or co carries zero patient liability') ||
      rawGuideText.includes('group code oa or co carries zero patient liability') ||
      rawGuideText.includes('group code oa automatically carries zero patient liability') ||
      rawGuideText.includes('group code oa universally establishes zero patient liability');

    if (assertsBlanketZeroLiability) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'CARC_18_PATIENT_LIABILITY_OVERREACH',
        severity: 'FATAL',
        message: 'Under official X12 standards and X12 RFI 2814, Group Code OA indicates an adjustment occurred but does not provide clear direction on adjustment liability on its own. The guide must not assert a blanket claim of zero patient liability merely because an adjustment uses OA or CO. Determining financial responsibility requires evaluating the group code, complete ERA, and original claim adjudication outcome together with applicable payer, contractual, program, and legal rules.',
        location: 'code_explanation.patient_billing_scope'
      });
    }
  }

  // =========================================================================
  // 6. COB Model Rules & Medicare MSP Validation
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '22') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    // Check if NAIC Model #120 is asserted as universal federal law/statute
    const assertsNAICFederalLaw =
      rawGuideText.includes('naic model regulation #120 is a federal mandate') ||
      rawGuideText.includes('naic model rules are federal law') ||
      rawGuideText.includes('federal naic mandate') ||
      rawGuideText.includes('naic is universally required by federal law') ||
      rawGuideText.includes('naic model regulation #120 is a federal statute') ||
      rawGuideText.includes('binding all commercial payers under federal law');

    // Check if Medicare is asserted as always/universally secondary in affirmative guidance sections
    const quickAnswerText = JSON.stringify(guide.quick_answer || {}).toLowerCase();
    const stepsText = JSON.stringify(guide.investigation_steps || []).toLowerCase();
    const explanationAffirmative = JSON.stringify(guide.code_explanation.what_code_establishes || []).toLowerCase();

    const assertsMedicareAlwaysSecondary =
      quickAnswerText.includes('medicare is always secondary') ||
      quickAnswerText.includes('medicare is universally secondary') ||
      quickAnswerText.includes('medicare is never primary when other coverage exists') ||
      stepsText.includes('medicare is always secondary') ||
      stepsText.includes('medicare is universally secondary') ||
      explanationAffirmative.includes('medicare is always secondary');

    if (assertsNAICFederalLaw || assertsMedicareAlwaysSecondary) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'COB_MODEL_RULE_OVERREACH',
        severity: 'FATAL',
        message: 'NAIC Model #120 is a model state regulation subject to state adoption and ERISA plan terms, not a universal federal mandate. Furthermore, under statutory Medicare Secondary Payer (MSP) rules (42 U.S.C. § 1395y(b)), Medicare is legally primary for small employers (<20 or <100 employees), after the 30-month ESRD coordination period, or when coordinating with retiree or Medigap coverage. The guide must not claim NAIC is federal law or that Medicare is always secondary.',
        location: 'quick_answer_or_investigation_steps'
      });
    }
  }

  // =========================================================================
  // 7. Emergency Protection Scoping (EMTALA vs No Surprises Act)
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    // Check if EMTALA is asserted as a commercial reimbursement mandate
    const assertsEMTALACommercialOverride =
      rawGuideText.includes('emtala requires commercial health plans to pay') ||
      rawGuideText.includes('emtala mandates commercial reimbursement') ||
      rawGuideText.includes('commercial health plans are legally mandated to pay and reimburse hospital claims under emtala') ||
      rawGuideText.includes('commercial health plans must pay under emtala') ||
      rawGuideText.includes('emtala overrides all commercial payer authorization denials');

    // Check if No Surprises Act prior-auth prohibitions are overgeneralized to elective care
    const assertsNoSurprisesActElective =
      rawGuideText.includes('no surprises act prohibits prior authorization for elective') ||
      rawGuideText.includes('no surprises act bans prior authorization for all medical procedures') ||
      rawGuideText.includes('elective care is exempt from prior authorization under the no surprises act');

    if (assertsEMTALACommercialOverride || assertsNoSurprisesActElective) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'EMERGENCY_PROTECTION_OVERREACH',
        severity: 'FATAL',
        message: 'EMTALA (42 U.S.C. § 1395dd) imposes hospital screening and stabilization obligations; it is not a commercial health plan reimbursement mandate. Furthermore, No Surprises Act prior-authorization prohibitions (45 CFR § 149.110) apply strictly to emergency services and cannot be overgeneralized to elective care.',
        location: 'quick_answer_or_investigation_steps'
      });
    }
  }

  // =========================================================================
  // 8. Retrospective Authorization Scope Validation
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    // Check if 24-72h retro-auth is asserted as a standard universal rule for all care/elective care
    const assertsUniversalRetroAuth =
      rawGuideText.includes('providers universally have 24 to 72 hours for retrospective authorization on all services') ||
      rawGuideText.includes('standard 24 to 72 hour retrospective authorization applies to all elective procedures') ||
      rawGuideText.includes('retrospective authorization is standard for all services within 72 hours') ||
      rawGuideText.includes('all payers must grant retrospective authorization if submitted within 24 to 72 hours for all services') ||
      rawGuideText.includes('all payers must grant retrospective authorization if submitted within 72 hours');

    if (assertsUniversalRetroAuth) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'RETRO_AUTH_SCOPE_OVERREACH',
        severity: 'FATAL',
        message: 'Retrospective authorization windows (e.g. 24-72 hours) are plan-specific policies applicable primarily to unplanned urgent or emergency hospital admissions. Elective scheduled services generally disallow retrospective authorization. The guide must not assert 24-72h retro-auth as a universal or standard rule for all care.',
        location: 'timeline_and_dates_or_steps'
      });
    }
  }

  return issues;
}

module.exports = { validateScopeSensitivity };
