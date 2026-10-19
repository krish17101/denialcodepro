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

    // Check if EMTALA is asserted as a commercial reimbursement mandate or prior-auth restriction on health plans
    const assertsEMTALACommercialOverride =
      rawGuideText.includes('emtala requires commercial health plans to pay') ||
      rawGuideText.includes('emtala mandates commercial reimbursement') ||
      rawGuideText.includes('commercial health plans are legally mandated to pay and reimburse hospital claims under emtala') ||
      rawGuideText.includes('commercial health plans must pay under emtala') ||
      rawGuideText.includes('under emtala (42 u.s.c. § 1395dd) and the federal no surprises act (45 cfr § 149.110), emergency screening') ||
      rawGuideText.includes('exempt from prior authorization under emtala and the no surprises act') ||
      rawGuideText.includes('emtala prohibits prior authorization') ||
      rawGuideText.includes('emtala prohibits health plans from requiring prior authorization') ||
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

  // =========================================================================
  // 9. No Surprises Act Notice-and-Consent (45 CFR § 149.420) Scoping
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    // Check if 45 CFR § 149.420 notice and consent is misapplied to in-network providers or generic prior-auth waivers
    const assertsNSAInNetworkWaiver =
      rawGuideText.includes('complying with federal balance-billing rules under the no surprises act (45 cfr § 149.420)') ||
      rawGuideText.includes('waiver complying with the no surprises act (45 cfr § 149.420)') ||
      rawGuideText.includes('compliant no surprises act advance financial liability notice') ||
      rawGuideText.includes('no surprises act (45 cfr § 149.420) allows in-network') ||
      rawGuideText.includes('in-network providers can bill under 45 cfr § 149.420') ||
      rawGuideText.includes('in-network providers cannot bill the patient unless a valid, signed advance waiver (such as an abn or compliant no surprises act');

    if (assertsNSAInNetworkWaiver) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'NO_SURPRISES_ACT_WAIVER_OVERREACH',
        severity: 'FATAL',
        message: 'Under 45 CFR § 149.420, No Surprises Act notice and consent applies strictly to nonparticipating (out-of-network) providers and facilities furnishing certain non-emergency items at participating facilities. It does not apply to in-network providers and cannot be used as a generic waiver to bypass plan prior-authorization requirements or shift contractual write-offs to patients.',
        location: 'patient_billing_scope_or_decision_outcomes'
      });
    }
  }

  // =========================================================================
  // 10. CMS Hospital Outpatient Department (OPD) Prior Auth & ABN Scoping
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    // Check if guide claims an ABN can be issued or patient billed when bypassing CMS OPD prior authorization,
    // or claims an ABN is universally required for every CO-197 denial,
    // or conflates ABN notice issuance with claim modifier submission.
    const assertsBypassOPDABN =
      rawGuideText.includes("for a provider's failure to obtain mandatory prior authorization unless a valid, signed advance beneficiary notice") ||
      rawGuideText.includes('billing the patient for an un-authorized service is strictly prohibited unless a valid, signed advance waiver was executed prior to rendering care. for original medicare ffs, an advance beneficiary notice of noncoverage (form cms-r-131) is required') ||
      rawGuideText.includes('an abn is universally required for every co-197') ||
      rawGuideText.includes('an abn is universally required for every carc 197') ||
      rawGuideText.includes('issuance of an abn with modifier ga') ||
      rawGuideText.includes('an abn with modifier ga must be executed') ||
      rawGuideText.includes('voluntary abn with modifier gx') ||
      (rawGuideText.includes('bypasses the prior authorization') && rawGuideText.includes('abn is appropriate'));

    if (assertsBypassOPDABN) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'CMS_OPD_ABN_OVERREACH',
        severity: 'FATAL',
        message: 'Under CMS Hospital Outpatient Department (OPD) Prior Authorization FAQs (Nov 14, 2024, Q55) and 42 CFR §§ 419.80–419.83, when a hospital bypasses the prior-authorization process, an ABN is NOT appropriate and the hospital may not charge the beneficiary. Under Q53, when prior authorization was requested and non-affirmed on medical necessity grounds, the hospital must issue the ABN to the beneficiary in advance and submit the claim appending modifier GA; under Q57, for ordinarily cosmetic procedures that may be medically necessary for a specific condition, the hospital must issue an advance ABN if denial is anticipated and submit the claim appending modifier GA; for statutorily excluded cosmetic care (Q56), issuing an ABN is voluntary and the claim is submitted appending modifier GX. The guide must not assert that an ABN is universally required for all CO-197 denials, conflate Q53 and Q57, or claim that bypassing prior auth permits ABN billing.',
        location: 'patient_billing_scope_or_medicare_ffs_rules'
      });
    }
  }

  // =========================================================================
  // 11. Medicare Advantage vs No Surprises Act Emergency Scoping
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    const assertsMANSA =
      rawGuideText.includes('medicare advantage under the no surprises act') ||
      rawGuideText.includes('medicare advantage plans are governed by the no surprises act') ||
      rawGuideText.includes('under the no surprises act (45 cfr § 149.110), medicare advantage') ||
      rawGuideText.includes('no surprises act protects medicare advantage') ||
      rawGuideText.includes('no surprises act (45 cfr § 149.110) applies to medicare advantage') ||
      rawGuideText.includes('no surprises act applies to medicare advantage');

    if (assertsMANSA) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'MA_NSA_CONFLATION',
        severity: 'FATAL',
        message: 'The guide conflates Medicare Advantage with the No Surprises Act. Medicare Advantage prior-authorization emergency protections are governed by 42 CFR § 422.113, not the federal No Surprises Act (45 CFR § 149.110).',
        location: 'quick_answer_or_investigation_steps'
      });
    }
  }

  // =========================================================================
  // 12. CARC 197 on Emergency Claims Categorical Ban Overreach
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    const assertsEmergencyImpossible =
      rawGuideText.includes('carc 197 can never appear on an emergency claim') ||
      rawGuideText.includes('carc 197 can never be reported on emergency') ||
      rawGuideText.includes('carc 197 is impossible on emergency claims') ||
      rawGuideText.includes('carc 197 never legitimately appears on emergency claims') ||
      rawGuideText.includes('emergency claims can never receive carc 197');

    if (assertsEmergencyImpossible) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'CARC_197_EMERGENCY_IMPOSSIBLE_OVERREACH',
        severity: 'FATAL',
        message: 'The guide asserts that CARC 197 can never legitimately appear on an emergency claim. CARC 197 can legitimately appear on emergency claims if non-emergency services were billed concurrently, if required program indicators (such as Medicare OPD modifier ET or revenue code 045x) were omitted, or if post-stabilization criteria were not satisfied.',
        location: 'code_explanation_or_scenarios'
      });
    }
  }

  // =========================================================================
  // 13. BPR16 Universal Appeal Trigger Overreach
  // =========================================================================
  if (guide.timeline_and_dates) {
    const rawGuideText = JSON.stringify(guide.timeline_and_dates).toLowerCase();

    const assertsBPR16UniversalTrigger =
      rawGuideText.includes('bpr16 is the universal denial date') ||
      rawGuideText.includes('bpr16 universally triggers provider appeal') ||
      rawGuideText.includes('bpr16 is the universal appeal trigger') ||
      rawGuideText.includes('bpr16 check date universally starts the appeal clock') ||
      rawGuideText.includes('bpr16 universally starts the appeal window');

    if (assertsBPR16UniversalTrigger) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'BPR16_UNIVERSAL_APPEAL_TRIGGER',
        severity: 'FATAL',
        message: 'Under X12 RFI 2061, BPR16 defines the check issue or EFT effective date, not the claim adjudication date or initial determination notice date. BPR16 is not the universal denial date or appeal trigger; appeal deadlines run from receipt of the initial determination notice (presumed 5 days after notice date per 42 CFR § 405.942 for Medicare FFS, 60 days from organization determination notice per 42 CFR § 422.582 for MA, or contractual/ERISA dates for commercial).',
        location: 'timeline_and_dates.timeline_events'
      });
    }
  }

  // =========================================================================
  // 14. Universal Authorization Validity Span Overreach
  // =========================================================================
  if (guide.timeline_and_dates) {
    const rawGuideText = JSON.stringify(guide.timeline_and_dates).toLowerCase();

    const assertsUniversalAuthValidity =
      rawGuideText.includes('prior authorizations universally remain valid for 60 to 180 days') ||
      rawGuideText.includes('authorizations universally have a 60 to 180 day validity span') ||
      rawGuideText.includes('standard 60 to 180 day authorization validity span applies to all payers') ||
      rawGuideText.includes('universal 60 to 180 day authorization validity');

    if (assertsUniversalAuthValidity) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'UNIVERSAL_AUTH_VALIDITY_OVERREACH',
        severity: 'FATAL',
        message: 'The guide asserts a universal 60 to 180 day authorization validity window. Prior authorization validity periods are not uniform; they are determined by each payer specific approval letter and policy (e.g. CMS OPD affirmations are valid for 120 days under the CMS OPD Operational Guide, while commercial spans vary by insurer and clinical specialty).',
        location: 'timeline_and_dates.general_rules'
      });
    }
  }

  // =========================================================================
  // 15. Universal Peer-to-Peer Window Overreach
  // =========================================================================
  if (guide.investigation_steps || guide.detailed_scenarios) {
    const rawGuideText = (JSON.stringify(guide.investigation_steps || []) + ' ' + JSON.stringify(guide.detailed_scenarios || [])).toLowerCase();

    const assertsUniversalP2PWindow =
      rawGuideText.includes('universal 5 to 14 day peer-to-peer') ||
      rawGuideText.includes('peer-to-peer review must universally be requested within 5 to 14 days') ||
      rawGuideText.includes('standard 5 to 14 day peer-to-peer window applies to all payers') ||
      rawGuideText.includes('all payers provide a standard 5 to 14 day p2p window');

    if (assertsUniversalP2PWindow) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'UNIVERSAL_P2P_WINDOW_OVERREACH',
        severity: 'FATAL',
        message: 'The guide asserts a universal 5 to 14 day peer-to-peer review window. P2P windows are strictly plan-specific and determined by individual payer medical management policies and adverse determination notices.',
        location: 'investigation_steps'
      });
    }
  }

  // =========================================================================
  // 16. Emergency Indicator Exemption Overreach
  // =========================================================================
  if (guide.code_explanation && guide.code_explanation.carc_code === '197') {
    const rawGuideText = JSON.stringify(guide).toLowerCase();

    const assertsIndicatorOverreach =
      rawGuideText.includes('place of service 20 or emergency diagnosis codes alone conclusively prove') ||
      rawGuideText.includes('pos 20 alone conclusively establishes exemption from prior authorization') ||
      rawGuideText.includes('billing pos 20 or pos 23 conclusively exempts all claim lines from prior authorization') ||
      rawGuideText.includes('emergency diagnosis codes alone conclusively establish exemption from prior authorization') ||
      rawGuideText.includes('pos 20 or emergency diagnosis alone conclusively establishes exemption');

    if (assertsIndicatorOverreach) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'EMERGENCY_INDICATOR_OVERREACH',
        severity: 'FATAL',
        message: 'The guide asserts that POS 20, POS 23, emergency revenue codes, or emergency diagnoses alone conclusively establish prior-authorization exemption. Clinical records must demonstrate an emergency medical condition meeting the prudent layperson standard and program-specific criteria, as non-emergency elective services billed concurrently or post-stabilization care may still require authorization.',
        location: 'code_explanation_or_investigation_steps'
      });
    }
  }

  // =========================================================================
  // 17. Medicare Advantage Appeal Notice Date vs Receipt & Scope Check
  // =========================================================================
  if (guide.timeline_and_dates || guide.medicare_ffs_rules) {
    const rawGuideText = (JSON.stringify(guide.timeline_and_dates || {}) + ' ' + JSON.stringify(guide.medicare_ffs_rules || {})).toLowerCase();

    const assertsMANoticeDateOnly =
      rawGuideText.includes('60 calendar days from the date of the organization determination notice') ||
      rawGuideText.includes('60-day appeal clock runs from the organization determination notice date') ||
      rawGuideText.includes('appeals must be filed within 60 calendar days from the date of the notice') ||
      rawGuideText.includes('medicare advantage appeals are universally due within 60 days from the notice date') ||
      rawGuideText.includes('all medicare advantage provider payment disputes must be filed within 60 days of notice') ||
      rawGuideText.includes('reconsideration is universally due 60 days from the notice date without receipt presumption');

    if (assertsMANoticeDateOnly) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'MA_APPEAL_RECEIPT_SCOPE_OVERREACH',
        severity: 'FATAL',
        message: 'Under 42 CFR § 422.582, Medicare Advantage reconsideration requests are due within 60 calendar days after receipt of the written organization determination notice (with receipt legally presumed 5 calendar days after the notice date unless evidence shows otherwise). The guide must not assert a universal 60-day deadline from the notice date alone without the receipt presumption, nor describe § 422.582 as a universal deadline for contracted provider payment disputes (which follow contractual dispute processes).',
        location: 'timeline_and_dates_or_medicare_ffs_rules'
      });
    }
  }

  // =========================================================================
  // 18. Commercial ERISA 180-Day Claimant Scope vs Provider Contractual Dispute
  // =========================================================================
  if (guide.timeline_and_dates || guide.commercial_payer_rules) {
    const rawGuideText = (JSON.stringify(guide.timeline_and_dates || {}) + ' ' + JSON.stringify(guide.commercial_payer_rules || {})).toLowerCase();

    const assertsERISAUniversalProviderDeadline =
      rawGuideText.includes('erisa 180-day appeal deadline universally governs all provider payment disputes') ||
      rawGuideText.includes('erisa 29 cfr § 2560.503-1 universally establishes a 180-day deadline for provider contractual disputes') ||
      rawGuideText.includes('erisa provides a universal 180-day deadline for provider payment disputes') ||
      rawGuideText.includes('all commercial provider payment disputes have a 180-day deadline under erisa') ||
      rawGuideText.includes('erisa appeal deadline universally applies to provider payment disputes') ||
      rawGuideText.includes('erisa 180-day deadline applies to all provider disputes') ||
      rawGuideText.includes('erisa claimant appeal period is a universal provider payment-dispute deadline') ||
      rawGuideText.includes('universal 180-day provider appeal deadline under erisa');

    if (assertsERISAUniversalProviderDeadline) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'ERISA_APPEAL_SCOPE_OVERREACH',
        severity: 'FATAL',
        message: 'Under 29 CFR § 2560.503-1, ERISA establishes a minimum 180-day appeal period for qualifying benefit plan claimants appealing adverse benefit determinations. It must not be presented as a universal deadline for an in-network provider\'s independent contractual payment dispute, which is governed by provider network agreements, plan administrative dispute manuals, and state prompt-pay rules.',
        location: 'timeline_and_dates_or_commercial_rules'
      });
    }
  }

  // =========================================================================
  // 19. ERISA Assignment of Benefits vs Authorized Representative Scope
  // =========================================================================
  if (guide.timeline_and_dates || guide.commercial_payer_rules) {
    const rawGuideText = (JSON.stringify(guide.timeline_and_dates || {}) + ' ' + JSON.stringify(guide.commercial_payer_rules || {})).toLowerCase();

    const assertsAOBUniversalRepresentation =
      rawGuideText.includes('assignment of benefits automatically authorizes every provider to appeal') ||
      rawGuideText.includes('assignment of benefits automatically makes every provider an authorized representative') ||
      rawGuideText.includes('assignment of benefits alone universally makes a provider an authorized representative') ||
      rawGuideText.includes('an assignment of benefits automatically entitles any provider to pursue an erisa appeal') ||
      rawGuideText.includes('holding an assignment of benefits automatically designates the provider as the claimant\'s authorized representative') ||
      rawGuideText.includes('an assignment of benefits universally entitles a provider to appeal for the claimant') ||
      rawGuideText.includes('any provider holding an assignment of benefits can automatically appeal as the claimant') ||
      rawGuideText.includes('an assignment of benefits automatically authorizes the provider to appeal') ||
      rawGuideText.includes('assignment of benefits automatically authorizes the provider to pursue an erisa appeal') ||
      rawGuideText.includes('an assignment of benefits automatically authorizes a provider to pursue the claimant\'s erisa appeal');

    if (assertsAOBUniversalRepresentation) {
      issues.push({
        rule: 'scope-sensitive',
        code: 'ERISA_AOB_REPRESENTATION_OVERREACH',
        severity: 'FATAL',
        message: 'Under 29 CFR § 2560.503-1 and Department of Labor guidance, an assignment of benefits (AOB) alone does not universally make a provider an authorized representative entitled to pursue an ERISA appeal for the claimant. Whether a provider can act on a claimant\'s behalf depends on the specific assignment terms, the plan\'s authorized-representative procedures established pursuant to 29 CFR § 2560.503-1(b)(4), plan terms (including enforceable anti-assignment provisions), and governing law. Furthermore, an in-network provider\'s independent contractual claim dispute is distinct from a claimant\'s ERISA benefit appeal.',
        location: 'timeline_and_dates_or_commercial_rules'
      });
    }
  }

  return issues;
}

module.exports = { validateScopeSensitivity };
