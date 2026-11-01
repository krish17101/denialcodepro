# Indexing release safeguard — 1 November 2026

## Completed scope

Prepared and tested an inactive release switch so a future approved production build can be indexed without also making preview deployments indexable. No hosted environment variables, domain configuration, live deployment, ad settings or permissions were changed. The code and test evidence belong to the existing preview branch. No public guide wording or research dossier was changed.

`lib/public/indexing.ts` requires both `DENIALCODEPRO_INDEXING_APPROVED=true` (exact lowercase value) and `VERCEL_ENV=production`. If `VERCEL_TARGET_ENV` is present, it must also equal `production`. Missing, conflicting, custom-target, preview and development configurations fail closed. The root metadata uses this policy. Search retains its explicit noindex; missing pages were checked using actual rendered responses.

This is a configuration safeguard, not an access-control system, a secret, Google approval or evidence that an operator approved content. The release flag has not been set on Vercel. Local test fixtures deliberately supplied it to exercise both outcomes.

## Current-run evidence

| Check | Actual result | Limits |
|---|---|---|
| `node scripts/test-indexing-policy.js` | 12 passed, 0 failed | Missing flag/environment; production without approval; disabled/noncanonical flag; preview/development/NODE_ENV alone; custom/conflicting target; two valid production configurations |
| Production fixture `npm run build` | Exit 0 | Local build with both production environment values and approval flag; lint skipped by existing config |
| `python scripts/audit-built-pages.py --indexing production` | 14 generated pages passed plus sitemap/robots checks | Public content indexable, not-found noindex, canonicals/links/metadata intact |
| Production fixture `python scripts/audit-release-http.py --indexing production --legacy-map docs/launch-readiness/LEGACY_ROUTE_DISPOSITION_2026-10-31.csv` | 322 HTTP cases passed, 0 failed | All 318 baseline paths plus four additional paths; local Next production server, not a live-domain crawl |
| Preview fixture `npm run build` | Exit 0 | Preview environment with approval flag deliberately set: remains noindex |
| `python scripts/audit-built-pages.py --indexing preview` | 14 generated pages passed plus sitemap/robots checks | Default audit mode remains preview |
| Preview fixture `python scripts/audit-release-http.py --indexing preview` | 6 HTTP cases passed, 0 failed | Home, Contact, deadline guide, search, code/1 and unknown guide; all noindex |
| Two negative controls | Both passed by rejecting the wrong fixture | Preview audit rejected indexable production HTML; production audit rejected noindex preview HTML; expected nonzero exits retained |
| `node scripts/check-publication-boundary.js --built` | 5 passed on each build | Held content boundaries unchanged; no legal clearance implied |
| `npm run typecheck` | Exit 0 after final preview build | Type compatibility |
| `git diff --check` | Exit 0 | Patch whitespace |
| Research key/SHA-256 comparison | 144 files identical, including 71 dossiers | Compared with existing research_before.json baseline |

The static audit now accepts an explicit expected mode and examines every robots/googlebot meta tag, rather than retaining only the last one. Its noindex assertions were not removed. The new HTTP audit checks status, metadata plus X-Robots-Tag, canonical on public successful pages, and custom not-found text. It makes read-only GET requests; it submits no feedback or patient data.

Evidence files in `evidence/`:

- `indexing-build-checks-2026-11-01.txt`: production and preview build/audit/type logs, including expected negative-control failures.
- `indexing-production-http-2026-11-01.json`: 322 response records.
- `indexing-preview-http-2026-11-01.json`: six response records.

The previously successful 21 search and 25 checklist/regression cases were not rerun in this checkpoint: their implementation did not change. This report does not recast historical tests as current results. No mobile or browser interaction test was performed for this metadata-only change. Deployed preview status is reported separately after the push.

## Reproduction

From the repository, run the policy test first. For the local production fixture, build with `VERCEL_ENV=production VERCEL_TARGET_ENV=production DENIALCODEPRO_INDEXING_APPROVED=true npm run build`; then use the same environment when starting `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3017`. Run the production static and HTTP audit commands above. Stop that server before rebuilding.

Repeat with both Vercel values set to `preview` while leaving the local approval flag true. Run the preview audit commands. The final local build in this checkpoint is that noindex preview fixture. Environment values were supplied to child processes, not written to an environment file or hosting account. Both temporary servers were stopped.

To reproduce negative controls, run the preview static audit against the production fixture and the production static audit against the preview fixture. Both must exit nonzero. Never label an unexpected failure a negative-control pass.

## Source inspection

Directly inspected on 1 November 2026:

- Vercel, System environment variables, sections VERCEL_ENV and VERCEL_TARGET_ENV: https://vercel.com/docs/environment-variables/system-environment-variables . The documented deployment environments support the explicit environment check. VERCEL_PROJECT_PRODUCTION_URL is also present on previews, so it is not used as evidence of a production deployment. No document publication date inferred.
- Google Search Central, Block Search indexing with noindex, opening explanation and Implementing noindex: https://developers.google.com/search/docs/crawling-indexing/block-indexing . Crawlers need access to observe noindex; the existing robots allow rule is retained. Noindex is not authentication.
- Next.js, notFound, opening behavior: https://nextjs.org/docs/app/api-reference/functions/not-found . Describes not-found rendering and injected noindex. Current page targets a newer Next version than this repository's 15.5.28; the actual installed version's rendered statuses and metadata were tested rather than assumed from the newer docs.

## Release operation remains pending

1. Close the operator/contact/privacy and mobile gaps from RELEASE_CHECKPOINT_2026-10-31.md. Approve the exact content and legacy-URL removal plan; unresolved code-library rights are not cleared by this change.
2. At an authorized production release, set the approval flag only in the intended Production environment. Confirm Vercel's system environment variables are exposed. A missing value should block indexing; do not bypass it by guessing values in production settings.
3. Build a fresh production artifact after changing the flag. Do not promote the previously tested noindex preview artifact and assume promotion rewrites its static metadata. Confirm actual deployment provenance and served HTML/header behavior before declaring launch complete.
4. Verify intended domain, canonical URLs, sitemap, redirects/404s, page-level robots and host-level X-Robots-Tag. Production aliases can share a build: this policy distinguishes build environments, not individual request hostnames. Review alias/header/domain behavior separately. A correct tag does not guarantee Google will index the page.
5. Keep search and missing pages noindex. If the release must be held, unset the flag and rebuild; existing cached/static artifacts need replacement. No live rollback or index removal was performed here.

## Remaining owner information

- Exact operator/person or business name and location intended for public disclosure.
- Confirmation that the existing contact mailbox is controlled, monitored and receives external test messages.
- Who can access feedback, how long it is retained, and the actual deletion process.

These facts cannot be established from a mailto link or invented from a template. The current browser API still does not expose a phone viewport. Mobile task checks, measured performance and representative-biller testing remain uncompleted; no launch, AdSense or expert-certification claim is made.
