import rawData from './v3_public_dataset.json';
import { co29Guide } from './guides/co29';
import {
  ApprovedKnowledgeBase,
  ApprovedCarc,
  ApprovedRarc,
  ApprovedDenialFingerprint,
  ApprovedPayerIntelligence,
  ApprovedPayerFingerprint,
  ApprovedSource,
} from './types';

export const knowledgeBase = rawData as unknown as ApprovedKnowledgeBase;

// Attach tracked structured guide to DF-037 (CO-29)
const df037 = knowledgeBase.denial_fingerprints?.find(df => df.record_id === 'DF-037' || df.carc === '29');
if (df037) {
  df037.structured_guide = co29Guide;
}

export function getCarcSlug(code: string) {
  return code.toLowerCase();
}

export function getRarcSlug(code: string) {
  return code.toLowerCase();
}

export function getDenialSlug(df: ApprovedDenialFingerprint) {
  const parts = [];
  if (df.group_code) parts.push(df.group_code);
  parts.push(df.carc);
  if (df.rarc) parts.push(df.rarc);
  return parts.join('-').toLowerCase();
}

export function getDenialTitle(df: ApprovedDenialFingerprint): string {
  if (df.group_code) {
    return df.rarc ? `${df.group_code}-${df.carc} ${df.rarc}` : `${df.group_code}-${df.carc}`;
  }
  return df.rarc ? `CARC ${df.carc} RARC ${df.rarc}` : `CARC ${df.carc}`;
}

export function getPayerSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export const carcsBySlug = new Map<string, ApprovedCarc>();
export const rarcsBySlug = new Map<string, ApprovedRarc>();
export const fingerprintsBySlug = new Map<string, ApprovedDenialFingerprint>();
export const payersBySlug = new Map<string, ApprovedPayerIntelligence>();
export const payerFingerprintsBySlug = new Map<string, ApprovedPayerFingerprint>();

knowledgeBase.carcs?.forEach((carc) => {
  // Deliberately exclude CARC 15 as requested
  if (carc.code === '15') return;
  carcsBySlug.set(getCarcSlug(carc.code), carc);
});

knowledgeBase.rarcs?.forEach((rarc) => {
  rarcsBySlug.set(getRarcSlug(rarc.code), rarc);
});

knowledgeBase.denial_fingerprints?.forEach((df) => {
  fingerprintsBySlug.set(getDenialSlug(df), df);
});

knowledgeBase.payer_intelligence?.forEach((payer) => {
  if (payer.Payer) payersBySlug.set(getPayerSlug(payer.Payer), payer);
});

knowledgeBase.payer_fingerprints?.forEach((pf) => {
  payerFingerprintsBySlug.set(pf.record_id.toLowerCase(), pf);
});
