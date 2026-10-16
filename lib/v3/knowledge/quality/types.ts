import { ComprehensiveDenialGuide, ApprovedKnowledgeBase } from '../types';

export type IssueSeverity = 'FATAL' | 'WARNING';

export interface ControlledCarcRecord {
  code: string;
  official_meaning: string;
  status: 'Current' | 'Deactivated' | 'Unverified';
  category: string;
  source_url: string;
  verified_date: string;
  usage_rules?: string[];
  requires_non_alert_rarc?: boolean;
  prohibits_initial_attachments?: boolean;
  diagnostic_domain?: string;
  prohibited_conflations?: string[];
}

export interface ControlledRarcRecord {
  code: string;
  official_meaning: string;
  type: 'Supplemental' | 'Informational' | 'Alert' | 'Unverified';
  status: 'Current' | 'Deactivated' | 'Unverified';
  diagnostic_domain: string;
  source_url: string;
  verified_date: string;
  is_alert?: boolean;
  authority_reference?: string | null;
  appeal_rights?: string | null;
  cannot_inherently_mean?: string[];
  prohibited_conflations?: string[];
}

export interface ControlledGroupCodeRecord {
  code: string;
  name: string;
  official_meaning: string;
  patient_liability_principles: string;
  source_url: string;
  verified_date: string;
}

export interface ControlledAuthorityRecord {
  id: string;
  authority: string;
  citation: string;
  title: string;
  scope: string;
  key_principle: string;
  source_url: string;
  verified_date: string;
}

export interface ValidationIssue {
  rule: string;
  code: string;
  severity: IssueSeverity;
  message: string;
  location?: string;
  context?: Record<string, unknown>;
}

export interface GuideValidationResult {
  guide_id: string;
  title: string;
  carc: string;
  status: 'PASSED' | 'BLOCKED';
  fatal_count: number;
  warning_count: number;
  issues: ValidationIssue[];
}

export interface DatasetValidationResult {
  status: 'PASSED' | 'BLOCKED';
  total_carcs_checked: number;
  total_rarcs_checked: number;
  registry_carcs_count?: number;
  registry_rarcs_count?: number;
  total_fingerprints_checked: number;
  total_guides_checked: number;
  fatal_count: number;
  warning_count: number;
  issues: ValidationIssue[];
  guide_results: GuideValidationResult[];
}

export interface FixtureTestResult {
  fixture_name: string;
  expected_outcome: 'SHOULD_FAIL' | 'SHOULD_PASS';
  expected_error_code?: string;
  actual_outcome: 'FAILED' | 'PASSED';
  detected_issues: ValidationIssue[];
  test_passed: boolean;
  notes: string;
}

export interface QualityGateSummary {
  overall_status: 'PASSED' | 'BLOCKED';
  timestamp: string;
  dataset_result: DatasetValidationResult;
  fixture_results: FixtureTestResult[];
}
