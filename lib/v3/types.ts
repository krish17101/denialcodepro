/**
 * V3 type definitions — Phase 1 foundation.
 *
 * These types describe the planned knowledge-base schema.
 * Data is NOT loaded from any source in Phase 1; these types
 * exist so that presentation components and the search layer
 * can be written against a stable interface before the
 * approved production knowledge-base is connected.
 *
 * Rules:
 *  - Do not invent CARC/RARC relationships or payer rules here.
 *  - Do not import old full_codes.json into these types.
 *  - Each concept (CARC, RARC, Payer, Guide) is distinct.
 */

// ---------------------------------------------------------------------------
// CARC — Claim Adjustment Reason Code
// ---------------------------------------------------------------------------

export type CarcGroup =
  | 'CO' // Contractual Obligation
  | 'CR' // Correction and Reversal
  | 'OA' // Other Adjustment
  | 'PI' // Payer Initiated Reductions
  | 'PR'; // Patient Responsibility

export interface CarcCode {
  /** e.g. "CO-16", "PR-204" */
  id: string;
  /** Numeric CARC number as issued by X12/CMS (e.g. "16") */
  number: string;
  /** Group prefix */
  group: CarcGroup;
  /** Official X12/CMS description */
  description: string;
  /** ISO date of last official change, if known */
  lastUpdated?: string;
  /** Whether this code can result in a full denial (vs. partial adjustment) */
  canDeny: boolean;
}

// ---------------------------------------------------------------------------
// RARC — Remittance Advice Remark Code
// ---------------------------------------------------------------------------

export type RarcCategory =
  | 'ALERT' // Informational — not a denial reason
  | 'REASON'; // Substantive denial/adjustment clarification

export interface RarcCode {
  /** e.g. "N382" */
  id: string;
  /** Official description from CMS */
  description: string;
  /** ALERT codes must not be treated as denial reasons */
  category: RarcCategory;
  /** ISO date of last official change, if known */
  lastUpdated?: string;
}

// ---------------------------------------------------------------------------
// Denial Workflow — the per-denial-combination resolution guide
// ---------------------------------------------------------------------------

/**
 * A "denial fingerprint" uniquely identifies a denial by the combination
 * of codes that appeared on the remittance advice.  A single CARC can
 * appear with zero or many RARCs.  The fingerprint is the canonical key
 * for a denial-resolution page.
 */
export interface DenialFingerprint {
  carc: string; // e.g. "CO-16"
  rarcs: string[]; // e.g. ["N382", "N479"] — may be empty
}

/**
 * The full denial-resolution workflow.
 * This is the data structure that a future approved knowledge-base entry
 * will satisfy.  Phase 1 does NOT populate these fields with invented content.
 */
export interface DenialWorkflow {
  /** URL slug — derived from the fingerprint, e.g. "co-16-n382" */
  slug: string;
  fingerprint: DenialFingerprint;

  // --- Section 1 ---
  whatHappened?: string;

  // --- Section 2 ---
  practicalDiagnosis?: string;

  // --- Section 3 ---
  firstChecks?: string[];

  // --- Section 4 ---
  claimFieldsToInspect?: ClaimField[];

  // --- Section 5 ---
  likelyCauses?: string[];

  // --- Section 6 ---
  correctionOrResubmission?: string[];

  // --- Section 7 ---
  reprocessingOrAppeal?: AppealGuidance;

  // --- Section 8 ---
  evidenceChecklist?: string[];

  // --- Section 9 ---
  wrongFixWarnings?: string[];

  // --- Section 10 ---
  prevention?: string[];

  // --- Section 11 ---
  medicareMacGuidance?: SourcedGuidance[];

  // --- Section 12 ---
  commercialPayerGuidance?: PayerGuidance[];

  // --- Section 13 ---
  sources?: VerificationSource[];
}

export interface ClaimField {
  fieldName: string;
  whatToCheck: string;
}

export interface AppealGuidance {
  whenAppropriate: string;
  timingNotes?: string;
  requiredDocuments?: string[];
}

export interface SourcedGuidance {
  authority: string;
  guidance: string;
  sourceUrl?: string;
}

export interface PayerGuidance {
  payerName: string;
  guidance: string;
  sourceUrl?: string;
}

export interface VerificationSource {
  title: string;
  url?: string;
  retrievedDate?: string;
}

// ---------------------------------------------------------------------------
// Payer
// ---------------------------------------------------------------------------

export interface Payer {
  slug: string;
  name: string;
  /** e.g. "commercial", "medicare", "medicaid", "tricare" */
  type: 'commercial' | 'medicare' | 'medicaid' | 'tricare' | 'other';
  websiteUrl?: string;
}

// ---------------------------------------------------------------------------
// Guide
// ---------------------------------------------------------------------------

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  /** ISO date */
  publishedDate?: string;
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export type SearchResultKind = 'carc' | 'rarc' | 'denial' | 'guide' | 'payer' | 'payer_fingerprint';

export interface SearchResult {
  kind: SearchResultKind;
  slug: string;
  title: string;
  summary: string;
  href: string;
}
