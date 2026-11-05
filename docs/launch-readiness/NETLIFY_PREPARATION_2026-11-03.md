# Netlify preparation — 3 November 2026

Preview-branch preparation only. Netlify remains paused per owner instruction; account state has not been independently inspected. No main merge, DNS change, hosted environment update or production deployment.

## Changes
- netlify.toml now runs npm run build, including package.json publication-boundary prebuild and postbuild checks.
- lib/public/indexing.ts and app/layout.tsx recognize Netlify's NETLIFY and CONTEXT build variables, in addition to the existing Vercel path.
- Explicit DENIALCODEPRO_INDEXING_APPROVED=true is still required. Netlify production may index only with NETLIFY=true, CONTEXT=production and no preview-server signal. Preview, branch, dev, missing, unknown and mixed host configurations fail closed. Approval is NOT configured in the repository or on a host.
- Search results and not-found pages retain their separate noindex handling.

Authority: Netlify, Build environment variables, Read-only variables / Build metadata; directly inspected 3 November 2026: https://docs.netlify.com/build/configure-builds/environment-variables/ . Documents NETLIFY=true, CONTEXT values and NETLIFY_PREVIEW_SERVER. These environment checks are a release safeguard, not authentication or legal approval.

## Later deployment procedure — not executed
1. Inspect actual connected Netlify project, production branch, paused state, build settings, environment scopes, Node version, runtime adapter and header/redirect rules. Do not assume Vercel success establishes Netlify compatibility.
2. Agree on the exact candidate commit and legacy URL disposition before merging or resuming builds. Keep rollback to the current live deploy available and record its deploy identifier.
3. Build/test a Netlify non-production candidate without promoting it. It must stay noindex. Verify search, guide routes, checklist, contact, canonical URLs, sitemap, real 404 responses and lack of unwanted scripts/forms. Inspect runtime adapter build output and host logs.
4. When production release is explicitly approved, set the indexing flag only for the production build context. Never spoof Vercel variables on Netlify. Build fresh; do not simply promote a previously compiled noindex preview.
5. Verify the actual domain's HTML robots and HTTP X-Robots-Tag, search/not-found noindex, canonical host, sitemap and legacy-route responses. Confirm no blanket robots disallow prevents intended crawling. Stop/rollback if material failures occur.
6. AdSense account and activation remain a later task. No approval, ranking, licensing or compliance guarantee follows from these checks.

## Limits
The local fixtures exercise Next.js rendered output using Netlify-like variables. They do not run Netlify's hosted adapter/runtime, confirm host account settings or prove final headers. Mobile acceptance is owner-reported. Website mailbox retention is a manual owner obligation. Existing content-rights and legacy-URL approval questions remain open.

## Executed checks

24 indexing-policy cases passed (node scripts/test-indexing-policy.js). Two local npm run build commands exited 0, one with NETLIFY=true / CONTEXT=production / approval=true, the other CONTEXT=deploy-preview with the same approval. Each corresponding python scripts/audit-built-pages.py --indexing production|preview audit passed 14 pages, sitemap and robots checks. Both builds ran the boundary hooks. npm run typecheck completed without TypeScript errors. All 144 research file hashes match the preserved baseline. Logs and fixture command/exit records: evidence/netlify-*.txt and evidence/netlify-results.json. No agent mobile or hosted Netlify test performed.
