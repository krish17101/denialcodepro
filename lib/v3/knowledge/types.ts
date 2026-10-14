export interface PublicationPolicy {
  searchable: boolean;
  indexable: boolean;
  workflow_available: boolean;
}

export interface ApprovedCarc {
  record_id: string;
  record_type: 'CARC';
  code: string;
  status: string;
  scope: string;
  meaning: string;
  source_basis: string;
  verified: string;
  publication: PublicationPolicy;
  related_fingerprints: string[];
  notes?: string | null;
}

export interface ApprovedRarc {
  record_id: string;
  record_type: 'RARC';
  code: string;
  status: string;
  type: string; // 'Supplemental' | 'Informational' etc.
  effective_start: string;
  meaning: string;
  operational_signal?: string;
  related_carc_guidance?: string;
  medicare_scope?: string;
  source_basis: string;
  verified: string;
  research_state?: string;
  publication: PublicationPolicy;
  diagnostic_map?: Record<string, string>;
  synonyms: string[];
  related_fingerprints: string[];
}

export interface ApprovedDenialFingerprint {
  record_id: string;
  record_type: 'Denial Fingerprint';
  scope: string;
  group_code: string | null;
  carc: string;
  rarc: string | null;
  rarc_type: string | null;
  pairing_status: string;
  evidence_grade: string;
  code_meaning: string;
  practical_diagnosis: string;
  first_60_second_checks: string;
  claim_fields_to_inspect: string;
  likely_root_causes: string;
  action_type: string;
  correction_path: string;
  appeal_path: string;
  evidence_package: string;
  wrong_fix_warning: string;
  prevention_control: string;
  medicare_mac_branch: string;
  commercial_payer_branch: string;
  source_evidence: string;
  last_verified: string;
  update_trigger?: string;
  publication: PublicationPolicy;
  structured_guide?: ComprehensiveDenialGuide;
}

export interface InvestigationStep {
  step_number: number;
  title: string;
  milestone: string;
  instructions: string[];
  records_or_fields?: { field: string; source_or_segment?: string; what_to_verify: string }[];
}

export interface DetailedScenario {
  id: string;
  title: string;
  trigger_condition: string;
  action_badge: string;
  action_type: 'PAYER_REVIEW_OR_DISPUTE' | 'INVESTIGATE_CORRECT_RESUBMIT' | 'SECONDARY_COB' | 'CORRECTED_OR_ADR_SUBMISSION' | 'EXCEPTION_REQUEST';
  resolution_path: string[];
  evidence_package: string[];
  pitfalls_and_warnings?: string[];
}

export interface DecisionOutcome {
  outcome_type: 'TIMELY_EVIDENCE_ESTABLISHED' | 'POSSIBLE_EXCEPTION_APPLIES' | 'GENUINELY_LATE_CLAIM' | 'UNRESOLVED_EVIDENCE';
  title: string;
  criteria: string;
  recommended_action: string;
  patient_billing_rules: string;
}

export interface TimelineEvent {
  event_name: string;
  field_or_source: string;
  evidence_role: string;
  significance_notes: string;
  applicable_scope?: string;
}

export interface MedicareException {
  exception_number: number;
  name: string;
  authority: string;
  qualifying_conditions: string;
  documentation_required: string[];
}

export interface CommercialPayerRule {
  payer_name: string;
  product_or_market: string;
  participation_status: string;
  claim_type: string;
  timely_filing_limit: string;
  secondary_claim_rule: string;
  appeal_limit: string;
  effective_period?: string;
  exceptions_summary: string;
  source_title: string;
  source_url: string;
  verified_date: string;
}

export interface PayerInquiryTemplate {
  title: string;
  context_use_case: string;
  subject_line: string;
  template_body: string;
  placeholders: { token: string; description: string }[];
}

export interface QuickAnswerQuestion {
  question_number: number;
  question: string;
  summary: string;
}

export interface QuickAnswer {
  title: string;
  questions: QuickAnswerQuestion[];
}

export interface ComprehensiveDenialGuide {
  guide_id: string;
  guide_title: string;
  guide_subtitle: string;
  quick_answer?: QuickAnswer;
  code_explanation: {
    carc_code: string;
    group_code: string;
    group_code_meaning: string;
    patient_billing_scope: string;
    what_code_establishes: string[];
    what_code_does_not_establish: string[];
  };
  initial_records_checklist: {
    record_type: string;
    purpose: string;
    where_to_find: string;
  }[];
  investigation_steps: InvestigationStep[];
  timeline_and_dates: {
    general_rules: string;
    timeline_events: TimelineEvent[];
    edi_distinction_notice: {
      ack_999_vs_277ca: string;
      internal_pm_dates_rule: string;
    };
  };
  decision_outcomes: DecisionOutcome[];
  detailed_scenarios: DetailedScenario[];
  medicare_ffs_rules: {
    filing_deadline_rule: string;
    date_convention_details: string;
    distinction_from_medicare_advantage: string;
    appeal_rights_limitation: string;
    beneficiary_billing_restriction: string;
    exceptions: MedicareException[];
  };
  commercial_payer_rules: {
    general_principles: string;
    payers: CommercialPayerRule[];
  };
  inquiry_template: PayerInquiryTemplate;
  wrong_fix_warnings: {
    action_to_avoid: string;
    why_it_fails: string;
    correct_alternative: string;
  }[];
  prevention_controls: {
    control_name: string;
    timing: string;
    operational_action: string;
  }[];
  final_resolution_checklist: string[];
  sources_and_governance: {
    authoritative_sources: {
      authority: string;
      title: string;
      citation?: string;
      url?: string;
      verified_date: string;
    }[];
    scope_limitations: string;
    last_reviewed_date: string;
  };
}

export interface ApprovedPayerIntelligence {
  Payer: string;
  'Market/Scope': string;
  'Correction Route': string;
  'Appeal/Reconsideration Route': string;
  'Key Timely-Filing Signal': string;
  'COB Signal': string;
  'Authorization/Clinical Signal': string;
  'Important Operational Rule': string;
  'Database Use': string;
  Source: string;
  Verified: string;
}

export interface ApprovedSource {
  'Source ID': string;
  Authority: string;
  Use: string;
  'URL/Reference': string;
  Verification: string;
}

export interface ApprovedSynonym {
  RARC: string;
  'Canonical Search Concept': string;
  'Example User Queries': string;
  'Search Handling': string;
  Confidence: string;
}

export interface ApprovedNormalization {
  'Input Pattern': string;
  'Normalize To': string;
  Priority: string;
  Example: string;
  Rule: string;
}

export interface ApprovedPayerFingerprint {
  record_id: string;
  record_type: string;
  payer: string | null;
  trigger: string | null;
  practical_diagnosis: string;
  first_checks: string;
  claim_fields_evidence: string | null;
  action_type: string;
  correction_path: string;
  appeal_path: string;
  wrong_fix_warning: string | null;
  prevention: string | null;
  source: string;
  verified: string;
  publication: {
    searchable: boolean;
    indexable: boolean;
    workflow_available: boolean;
  };
}

export interface ApprovedKnowledgeBase {
  metadata: {
    source_workbook: string;
    release: string;
    generated_on: string;
  };
  carcs: ApprovedCarc[];
  rarcs: ApprovedRarc[];
  denial_fingerprints: ApprovedDenialFingerprint[];
  payer_intelligence: ApprovedPayerIntelligence[];
  payer_fingerprints: ApprovedPayerFingerprint[];
  authoritative_sources: ApprovedSource[];
  search_synonyms: ApprovedSynonym[];
  search_normalization: ApprovedNormalization[];
}
