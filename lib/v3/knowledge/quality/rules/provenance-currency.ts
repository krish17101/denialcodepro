import { ComprehensiveDenialGuide } from '../../types';
import { ValidationIssue } from '../types';

export function validateProvenanceAndCurrency(guide: ComprehensiveDenialGuide): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const today = new Date().toISOString().split('T')[0];

  // =========================================================================
  // 1. Authoritative Sources in sources_and_governance
  // =========================================================================
  const governance = guide.sources_and_governance;
  if (!governance) {
    issues.push({
      rule: 'provenance-currency',
      code: 'PROVENANCE_MISSING',
      severity: 'FATAL',
      message: 'Guide lacks the required sources_and_governance section.',
      location: 'sources_and_governance'
    });
    return issues;
  }

  // Check last_reviewed_date
  if (!governance.last_reviewed_date) {
    issues.push({
      rule: 'provenance-currency',
      code: 'DATE_CURRENCY_INVALID',
      severity: 'FATAL',
      message: 'Guide lacks a last_reviewed_date in sources_and_governance.',
      location: 'sources_and_governance.last_reviewed_date'
    });
  } else if (!isoDateRegex.test(governance.last_reviewed_date)) {
    issues.push({
      rule: 'provenance-currency',
      code: 'DATE_CURRENCY_INVALID',
      severity: 'FATAL',
      message: `last_reviewed_date "${governance.last_reviewed_date}" is not a valid ISO-8601 date (YYYY-MM-DD).`,
      location: 'sources_and_governance.last_reviewed_date'
    });
  } else if (governance.last_reviewed_date > today) {
    issues.push({
      rule: 'provenance-currency',
      code: 'DATE_CURRENCY_INVALID',
      severity: 'FATAL',
      message: `last_reviewed_date "${governance.last_reviewed_date}" is set in the future. Dates cannot be advanced without actual review.`,
      location: 'sources_and_governance.last_reviewed_date'
    });
  }

  // Check authoritative_sources array
  if (!governance.authoritative_sources || governance.authoritative_sources.length === 0) {
    issues.push({
      rule: 'provenance-currency',
      code: 'PROVENANCE_MISSING',
      severity: 'FATAL',
      message: 'Guide authoritative_sources array is empty. Consequential policy claims require verified sources.',
      location: 'sources_and_governance.authoritative_sources'
    });
  } else {
    governance.authoritative_sources.forEach((source, idx) => {
      if (!source.authority || !source.title) {
        issues.push({
          rule: 'provenance-currency',
          code: 'PROVENANCE_MISSING',
          severity: 'FATAL',
          message: `Authoritative source [${idx}] lacks required authority or title.`,
          location: `sources_and_governance.authoritative_sources[${idx}]`
        });
      }

      if (!source.url || !source.url.startsWith('https://')) {
        issues.push({
          rule: 'provenance-currency',
          code: 'PROVENANCE_MISSING',
          severity: 'FATAL',
          message: `Authoritative source [${source.title || idx}] has missing or invalid HTTPS URL.`,
          location: `sources_and_governance.authoritative_sources[${idx}].url`
        });
      }

      if (!source.verified_date || !isoDateRegex.test(source.verified_date)) {
        issues.push({
          rule: 'provenance-currency',
          code: 'DATE_CURRENCY_INVALID',
          severity: 'FATAL',
          message: `Authoritative source [${source.title || idx}] lacks a valid ISO-8601 verified_date.`,
          location: `sources_and_governance.authoritative_sources[${idx}].verified_date`
        });
      } else if (source.verified_date > today) {
        issues.push({
          rule: 'provenance-currency',
          code: 'DATE_CURRENCY_INVALID',
          severity: 'FATAL',
          message: `Authoritative source [${source.title || idx}] has a future verified_date "${source.verified_date}".`,
          location: `sources_and_governance.authoritative_sources[${idx}].verified_date`
        });
      }
    });
  }

  // =========================================================================
  // 2. Commercial Payer Sources
  // =========================================================================
  if (guide.commercial_payer_rules?.payers) {
    guide.commercial_payer_rules.payers.forEach((payer, idx) => {
      if (!payer.source_title || !payer.source_url) {
        issues.push({
          rule: 'provenance-currency',
          code: 'PROVENANCE_MISSING',
          severity: 'FATAL',
          message: `Commercial payer card [${payer.payer_name}] lacks a source_title or source_url.`,
          location: `commercial_payer_rules.payers[${idx}]`
        });
      } else if (!payer.source_url.startsWith('https://')) {
        issues.push({
          rule: 'provenance-currency',
          code: 'PROVENANCE_MISSING',
          severity: 'FATAL',
          message: `Commercial payer card [${payer.payer_name}] source_url must be a valid HTTPS URL.`,
          location: `commercial_payer_rules.payers[${idx}].source_url`
        });
      }

      if (!payer.verified_date || !isoDateRegex.test(payer.verified_date)) {
        issues.push({
          rule: 'provenance-currency',
          code: 'DATE_CURRENCY_INVALID',
          severity: 'FATAL',
          message: `Commercial payer card [${payer.payer_name}] lacks a valid ISO-8601 verified_date.`,
          location: `commercial_payer_rules.payers[${idx}].verified_date`
        });
      } else if (payer.verified_date > today) {
        issues.push({
          rule: 'provenance-currency',
          code: 'DATE_CURRENCY_INVALID',
          severity: 'FATAL',
          message: `Commercial payer card [${payer.payer_name}] has a future verified_date "${payer.verified_date}".`,
          location: `commercial_payer_rules.payers[${idx}].verified_date`
        });
      }
    });
  }

  // =========================================================================
  // 3. Consequential Statutory Citations
  // =========================================================================
  const medicareRules = guide.medicare_ffs_rules;
  if (medicareRules) {
    const allMedicareText = (
      medicareRules.filing_deadline_rule + ' ' +
      medicareRules.appeal_rights_limitation + ' ' +
      medicareRules.exceptions.map(e => e.authority).join(' ')
    ).toLowerCase();

    // Timely filing authority citation (42 CFR 424.44 or Social Security Act 1848/1869)
    if (!allMedicareText.includes('424.44') && !allMedicareText.includes('pub. 100-04')) {
      issues.push({
        rule: 'provenance-currency',
        code: 'PROVENANCE_MISSING',
        severity: 'FATAL',
        message: 'Medicare FFS rules section lacks explicit citation to governing statutory/regulatory authority (42 CFR § 424.44 or CMS IOM Pub. 100-04).',
        location: 'medicare_ffs_rules'
      });
    }
  }

  return issues;
}
