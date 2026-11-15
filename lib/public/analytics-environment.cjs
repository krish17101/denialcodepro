// Evaluate during next build. Function runtimes need not expose Netlify build context.
function analyticsProduction(env) {
  if (env.NODE_ENV !== 'production' || env.NETLIFY !== 'true' || env.CONTEXT !== 'production') return false;
  return !env.NETLIFY_PREVIEW_SERVER && !env.VERCEL_ENV && !env.VERCEL_TARGET_ENV;
}

module.exports = { analyticsProduction };
