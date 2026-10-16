import { ComprehensiveDenialGuide } from '../../types';
import {
  ControlledCarcRecord,
  ControlledRarcRecord,
  ValidationIssue
} from '../types';

export function validateCodeIntegrity(
  guide: ComprehensiveDenialGuide,
  controlledCarcs: Map<string, ControlledCarcRecord>,
  controlledRarcs: Map<string, ControlledRarcRecord>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // 1. CARC code existence & status
  const carcCode = guide.code_explanation.carc_code;
  const carcRecord = controlledCarcs.get(carcCode);

  if (!carcRecord) {
    issues.push({
      rule: 'code-integrity',
      code: 'CODE_NOT_FOUND',
      severity: 'FATAL',
      message: `CARC ${carcCode} is not in the controlled verified registry.`,
      location: 'code_explanation.carc_code',
      context: { carcCode }
    });
  } else if (carcRecord.status !== 'Current') {
    issues.push({
      rule: 'code-integrity',
      code: 'CODE_UNVERIFIED_OR_DEACTIVATED',
      severity: 'FATAL',
      message: `CARC ${carcCode} has status "${carcRecord.status}", not "Current". Deactivated or unverified codes cannot be published as current guides.`,
      location: 'code_explanation.carc_code',
      context: { carcCode, status: carcRecord.status }
    });
  }

  // 1b. Specific CARC 16 usage rules
  if (carcCode === '16') {
    const guideStr = JSON.stringify(guide).toLowerCase();
    if (
      guideStr.includes('use carc 16 for initial claim attachments') ||
      guideStr.includes('carc 16 should be used for initial attachments')
    ) {
      issues.push({
        rule: 'code-integrity',
        code: 'CARC_USAGE_VIOLATION',
        severity: 'FATAL',
        message: 'CARC 16 explicitly prohibits initial claim attachments or documentation (X12 usage rule).',
        location: 'code_explanation'
      });
    }
  }

  // 2. Validate all RARCs mentioned in detailed_scenarios, quick_answer, decision_outcomes
  const guideJson = JSON.stringify(guide);
  const rarcRegex = /\b(MA[0-9]+|[MN][0-9]+)\b/g;
  const referencedRarcs = new Set<string>();
  let match;
  while ((match = rarcRegex.exec(guideJson)) !== null) {
    referencedRarcs.add(match[1].toUpperCase());
  }

  Array.from(referencedRarcs).forEach((rarcCode) => {
    const rarcRecord = controlledRarcs.get(rarcCode);
    if (!rarcRecord) {
      issues.push({
        rule: 'code-integrity',
        code: 'CODE_NOT_FOUND',
        severity: 'FATAL',
        message: `RARC ${rarcCode} referenced in guide is not in the controlled verified RARC registry.`,
        location: 'guide_content',
        context: { rarcCode }
      });
      return;
    }

    if (rarcRecord.status !== 'Current') {
      issues.push({
        rule: 'code-integrity',
        code: 'CODE_UNVERIFIED_OR_DEACTIVATED',
        severity: 'FATAL',
        message: `RARC ${rarcCode} has status "${rarcRecord.status}". Non-current codes cannot be used as active diagnostic advice.`,
        location: 'guide_content',
        context: { rarcCode, status: rarcRecord.status }
      });
    }
  });

  // 3. Inspect semantic meaning accuracy for key diagnostic codes
  for (const scenario of guide.detailed_scenarios) {
    const titleLower = scenario.title.toLowerCase();
    const triggerLower = scenario.trigger_condition.toLowerCase();
    const scenarioAll = (
      scenario.title + ' ' +
      scenario.trigger_condition + ' ' +
      scenario.resolution_path.join(' ') + ' ' +
      (scenario.pitfalls_and_warnings || []).join(' ')
    ).toLowerCase();

    // Check N382: Patient identifier, NEVER coordination of benefits
    if (triggerLower.includes('n382') || titleLower.includes('n382')) {
      const hasCobConflation =
        titleLower.includes('coordination of benefits') ||
        titleLower.includes('cob') ||
        triggerLower.includes('coordination of benefits') ||
        triggerLower.includes('cob') ||
        (scenarioAll.includes('coordination of benefits') && !scenarioAll.includes('patient identifier') && !scenarioAll.includes('member id'));

      if (hasCobConflation) {
        issues.push({
          rule: 'code-integrity',
          code: 'RARC_SEMANTIC_MISMATCH',
          severity: 'FATAL',
          message: `RARC N382 is defined by X12 as "Missing/incomplete/invalid patient identifier". It cannot be described or classified as a Coordination of Benefits (COB) or primary EOB code.`,
          location: `detailed_scenarios[${scenario.id}]`,
          context: { scenarioId: scenario.id, code: 'N382' }
        });
      }
    }

    // Check N300 / N301: Occurrence-span dates / Procedure dates, NEVER COB
    if (triggerLower.includes('n300') || titleLower.includes('n300')) {
      const hasCobConflation =
        titleLower.includes('coordination of benefits') ||
        titleLower.includes('cob') ||
        triggerLower.includes('coordination of benefits') ||
        triggerLower.includes('cob') ||
        (scenarioAll.includes('coordination of benefits') && !scenarioAll.includes('occurrence span'));

      if (hasCobConflation) {
        issues.push({
          rule: 'code-integrity',
          code: 'RARC_SEMANTIC_MISMATCH',
          severity: 'FATAL',
          message: `RARC N300 is defined by X12 as "Missing/incomplete/invalid occurrence-span dates". It cannot be assigned to missing COB information.`,
          location: `detailed_scenarios[${scenario.id}]`,
          context: { scenarioId: scenario.id, code: 'N300' }
        });
      }
    }

    if (triggerLower.includes('n301') || titleLower.includes('n301')) {
      const hasCobConflation =
        titleLower.includes('coordination of benefits') ||
        titleLower.includes('cob') ||
        triggerLower.includes('coordination of benefits') ||
        triggerLower.includes('cob') ||
        (scenarioAll.includes('coordination of benefits') && !scenarioAll.includes('procedure date'));

      if (hasCobConflation) {
        issues.push({
          rule: 'code-integrity',
          code: 'RARC_SEMANTIC_MISMATCH',
          severity: 'FATAL',
          message: `RARC N301 is defined by X12 as "Missing/incomplete/invalid procedure date(s)". It cannot be assigned to missing COB information.`,
          location: `detailed_scenarios[${scenario.id}]`,
          context: { scenarioId: scenario.id, code: 'N301' }
        });
      }
    }

    // Check M51: Procedure code(s), NOT inherently indicating a modifier error
    if (triggerLower.includes('m51') || titleLower.includes('m51')) {
      const mentionsModifier = scenarioAll.includes('modifier');
      const hasModifierCaution =
        scenarioAll.includes('do not assume') ||
        scenarioAll.includes('caution') ||
        scenarioAll.includes('procedure code') ||
        scenarioAll.includes('not inherently');

      if (
        (scenarioAll.includes('m51 inherently indicates a modifier error') ||
         scenarioAll.includes('m51 indicates a modifier error') ||
         scenarioAll.includes('m51 modifier mismatch') ||
         (mentionsModifier && !hasModifierCaution))
      ) {
        issues.push({
          rule: 'code-integrity',
          code: 'RARC_SEMANTIC_MISMATCH',
          severity: 'FATAL',
          message: `RARC M51 is defined by X12 as "Missing/incomplete/invalid procedure code(s)". It must not be treated as inherently indicating a modifier error without clear procedure-code grounding.`,
          location: `detailed_scenarios[${scenario.id}]`,
          context: { scenarioId: scenario.id, code: 'M51' }
        });
      }
    }
  }

  // 4. Inspect Quick Answer if present
  if (guide.quick_answer) {
    const qaText = JSON.stringify(guide.quick_answer).toLowerCase();
    const n382PairedWithCob =
      /(n382\s+(is|for|as|indicates|meaning)?\s*(a\s+)?(coordination of benefits|cob))/i.test(qaText) ||
      /(n382\s*\([^)]*cob[^)]*\))/i.test(qaText);

    if (n382PairedWithCob) {
      issues.push({
        rule: 'code-integrity',
        code: 'RARC_SEMANTIC_MISMATCH',
        severity: 'FATAL',
        message: 'Quick Answer pairs N382 with coordination of benefits. Official definition is patient identifier.',
        location: 'quick_answer',
        context: { code: 'N382' }
      });
    }

    const m51PairedSolelyWithModifier =
      /(m51\s+(is|for|as|indicates|meaning)?\s*(a\s+)?(modifier error|modifier mismatch))/i.test(qaText);

    if (m51PairedSolelyWithModifier) {
      issues.push({
        rule: 'code-integrity',
        code: 'RARC_SEMANTIC_MISMATCH',
        severity: 'FATAL',
        message: 'Quick Answer defines M51 solely as a modifier code. Official definition is procedure code.',
        location: 'quick_answer',
        context: { code: 'M51' }
      });
    }
  }

  return issues;
}
