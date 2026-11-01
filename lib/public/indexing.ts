type IndexingEnvironment = {
  DENIALCODEPRO_INDEXING_APPROVED?: string;
  VERCEL_ENV?: string;
  VERCEL_TARGET_ENV?: string;
};

// A build-time release switch, not authentication or proof of editorial approval.
// Leave unset until the specific production release has been approved.
export function publicIndexingEnabled(env: IndexingEnvironment): boolean {
  return env.DENIALCODEPRO_INDEXING_APPROVED === 'true'
    && env.VERCEL_ENV === 'production'
    && (env.VERCEL_TARGET_ENV === undefined || env.VERCEL_TARGET_ENV === 'production');
}
