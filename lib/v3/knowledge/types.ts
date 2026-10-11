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
  update_trigger: string;
  publication: PublicationPolicy;
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
