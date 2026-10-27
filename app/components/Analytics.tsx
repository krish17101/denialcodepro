/**
 * Deliberately disabled for the launch-readiness candidate.
 * Re-enable only after the actual analytics/consent configuration and privacy
 * disclosures are reviewed. Never send raw search text or patient information.
 * Keeping the component preserves the layout integration without loading GA.
 */
export function Analytics() {
  return null;
}
