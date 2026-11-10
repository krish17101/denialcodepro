// Server-only deployment signals; never enable the production stream on a branch build.
export function analyticsProduction(env: NodeJS.ProcessEnv) {
  if (env.NODE_ENV !== 'production' || env.NETLIFY !== 'true' || env.CONTEXT !== 'production') return false;
  return !env.NETLIFY_PREVIEW_SERVER && !env.VERCEL_ENV && !env.VERCEL_TARGET_ENV;
}
