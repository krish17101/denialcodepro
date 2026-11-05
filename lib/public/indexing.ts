type IndexingEnvironment = {
  DENIALCODEPRO_INDEXING_APPROVED?: string;
  VERCEL_ENV?: string;
  VERCEL_TARGET_ENV?: string;
  NETLIFY?: string;
  CONTEXT?: string;
  NETLIFY_PREVIEW_SERVER?: string;
};

// A build-time release switch, not authentication or proof of editorial approval.
// Leave unset until the specific production release has been approved.
export function publicIndexingEnabled(env: IndexingEnvironment): boolean {
  if (env.DENIALCODEPRO_INDEXING_APPROVED !== 'true') return false;
  // Ambiguous host signals must not enable indexing.
  const netlifySignals = env.NETLIFY !== undefined || env.CONTEXT !== undefined
    || env.NETLIFY_PREVIEW_SERVER !== undefined;
  const vercelSignals = env.VERCEL_ENV !== undefined || env.VERCEL_TARGET_ENV !== undefined;
  if (netlifySignals && vercelSignals) return false;
  if (netlifySignals) {
    return env.NETLIFY === 'true' && env.CONTEXT === 'production'
      && env.NETLIFY_PREVIEW_SERVER === undefined;
  }
  return env.VERCEL_ENV === 'production'
    && (env.VERCEL_TARGET_ENV === undefined || env.VERCEL_TARGET_ENV === 'production');
}
