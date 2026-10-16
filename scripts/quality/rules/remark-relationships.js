/**
 * Rule: remark-relationships
 * Ensures universal pairings are not asserted without authoritative sources
 * and distinguishes Alert remarks from diagnostic remarks.
 */

function validateRemarkRelationships(guide, controlledRarcs) {
  const issues = [];
  const carcCode = guide.code_explanation.carc_code;

  // 1. CARC 16 Alert Remark Usage Check
  if (carcCode === '16') {
    for (const scenario of guide.detailed_scenarios) {
      const trigger = scenario.trigger_condition;
      const rarcRegex = /\b(MA[0-9]+|[MN][0-9]+)\b/g;
      const codesInTrigger = [];
      let m;
      while ((m = rarcRegex.exec(trigger)) !== null) {
        codesInTrigger.push(m[1].toUpperCase());
      }

      if (codesInTrigger.length > 0) {
        const nonAlertCodes = codesInTrigger.filter(c => {
          const rec = controlledRarcs.get(c);
          return rec ? !rec.is_alert : true;
        });

        if (nonAlertCodes.length === 0) {
          issues.push({
            rule: 'remark-relationships',
            code: 'ALERT_REMARK_AS_DIAGNOSTIC_CAUSE',
            severity: 'FATAL',
            message: `Scenario "${scenario.title}" relies solely on Alert remark code(s) (${codesInTrigger.join(', ')}). Under X12 CARC 16 usage rules, CARC 16 requires at least one non-alert RARC or reject code to identify the diagnostic deficiency.`,
            location: `detailed_scenarios[${scenario.id}].trigger_condition`,
            context: { scenarioId: scenario.id, codesInTrigger }
          });
        }
      }
    }
  }

  // 2. Universal Pairing Assertion Check
  const guideText = JSON.stringify(guide).toLowerCase();
  if (
    guideText.includes('carc 16 always appears with') ||
    guideText.includes('always accompanies carc 16') ||
    guideText.includes('universally required remark code')
  ) {
    const hasAuthorityCitation = guide.sources_and_governance.authoritative_sources.some(
      s => s.authority.toLowerCase().includes('x12') || (s.citation && s.citation.toLowerCase().includes('tr3'))
    );
    if (!hasAuthorityCitation) {
      issues.push({
        rule: 'remark-relationships',
        code: 'UNIVERSAL_PAIRING_UNSUPPORTED',
        severity: 'FATAL',
        message: 'A CARC/RARC pairing is asserted as universal without an authoritative standards citation. Pairings must be explicitly conditional on the payer and remittance advice.',
        location: 'code_explanation'
      });
    }
  }

  return issues;
}

module.exports = { validateRemarkRelationships };
