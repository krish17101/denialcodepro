# Contact and release-readiness checkpoint — 31 October 2026

## Result

Added `/contact` to the original-guide preview, with a footer link and sitemap entry. It explains how to report a correction, keeps patient information out of feedback, and distinguishes website feedback from individual claim handling. It uses the existing published email address without claiming delivery, response times, credentials or a business identity. No form, new processor, advertisement, tracking integration, code article, production indexing change or live merge was introduced.

Implementation: `6ee602dc86af4569eede9c7017d9cd279d50eac6`. Vercel reported success: https://vercel.com/krish17101s-projects/denialcodepro/Fk6fU3eAR1ESzbWfDVLS4FQstfoo .

Preview inspected: https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/contact .

## Actual changes

- `app/contact/page.tsx`: original website contact instructions, privacy warning, guide/privacy links and unique metadata.
- `app/components/SiteFooter.tsx`: Contact link.
- `app/sitemap.ts`: Contact URL.
- `scripts/check-publication-boundary.js`: added exactly this new route to the explicit allowlist. Held-content exclusions and all other assertions remain intact. This is an intentional scope update, not removal of a failing check.
- This checkpoint, a route-disposition CSV, evidence logs/screenshot, and the standing direction document record the result.

## Executed software checks

| Command/check | Result | Scope |
|---|---|---|
| `npm run build` | Exit 0; compilation and 19 static-generation jobs reported | Lint skipped by existing config; no lint pass claimed |
| `npm run typecheck` | Exit 0 | Type compatibility |
| `python scripts/audit-built-pages.py` | 14 generated pages passed; exact sitemap/robots assertions passed | Includes not-found; dynamic search separately tested |
| `node scripts/check-publication-boundary.js --built` | 5 passed, 0 failed; 109 build artifacts, 28 reachable modules | Dependency boundary plus sampled held-description scan, not rights clearance |
| `node scripts/test-public-search.js` | 21 passed, 0 failed | Search behavior and rendered controls |
| `npm run test:launch` | 25 passed, 0 failed | 18 checklist cases and 7 regression checks |
| Local HTTP script below | 6 passed, 0 failed on final attempt | Status, expected content and noindex presence |
| `git diff --check` | Exit 0 | Whitespace |
| Research key/hash comparison | 144 identical files, including 71 dossiers | Against existing `launch_work/research_before.json`; no factual re-audit |

Evidence: `evidence/release-build-2026-10-31.txt`, `evidence/release-tests-2026-10-31.txt`, `evidence/release-http-2026-10-31.json`. Build log ends after static generation; the tool reported exit 0. Boundary checks were therefore explicitly executed separately and their results are recorded above.

The first HTTP attempt failed with connection refused after a separately launched local server became unavailable. No case passed in that attempt. Starting and stopping the server inside the same Python process resolved the test-harness problem. The successful run used `node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3017`, Python `urllib.request.urlopen`, and these exact cases:

| Path | Expected and observed HTTP status | Required body text |
|---|---|---|
| `/contact` | 200 | Contact DenialCodePro |
| `/code/1` | 404 | This page is not available in this release |
| `/adjustment-codes` | 404 | This page is not available in this release |
| `/denial-codes` | 404 | This page is not available in this release |
| `/guides/not-a-published-guide` | 404 | This page is not available in this release |
| `/search?q=deadline` | 200 | Check the rule before calculating a claim deadline |

Each also required `noindex` in the response body. These are local production-server checks, not assertions about every deployed legacy URL.

## Executed desktop checks

Four targeted checks passed at 1363 × 936 on the deployed preview:

1. Contact page displayed expected title, correction instructions, expanded privacy warning and educational-service limitation.
2. No horizontal overflow; canonical `https://denialcodepro.com/contact`; robots `noindex, follow`; all three rendered email links used the existing address; no form present. Screenshot visually inspected.
3. Clicked Read the privacy policy; observed the Privacy Policy heading and current notice.
4. Clicked Contact in that page's footer; returned to the Contact page and expected heading.

Screenshot: `evidence/contact-2026-10-31.jpg`. No email link was used to send a message. Email client launch, mailbox ownership, delivery, replies and spam-folder behavior were NOT tested. This is not an all-page browser rerun, mobile test or independent usability study.

## Privacy/operator findings

| Fact | Evidence and present state | Remaining action |
|---|---|---|
| Email address | Existing source and deployed preview use denialcodepro@gmail.com | Owner confirms control and receipt from an external test account; retain only delivery outcome, not private message content |
| Hosting | Vercel preview deployment observed | Confirm production project settings, logging/retention and enabled integrations; no account-settings inspection claimed |
| Feedback processor | `FeedbackForm.tsx` enables Web3Forms only when its public environment key exists; preview renders email fallback | Confirm production configuration; if form is enabled, verify processing disclosures and actual delivery before release |
| Analytics/ads | Application Analytics returns null; current regression checks pass | Confirm host/account-level injections separately before changing notice or claiming complete absence of telemetry |
| Checklist | Existing tests confirm categorical state has no application storage/network submission | Keep patient details out of inputs; hosting requests still exist |
| Operator identity | No confirmed publishable operator/entity details in this task | Owner supplies exact name/entity and location intended for disclosure; no invented credentials or address |
| Email retention/access/deletion | Not established from source code | Owner confirms who accesses messages, retention practice and deletion process before notice completion |

The privacy page was inspected but not rewritten around assumed operational facts. No assertion of comprehensive legal compliance or license-free publication is made.

## Mobile acceptance work still open

The current documented cloud-browser controls expose no viewport/device emulation. All seven cases below are BLOCKED here, not passed. Responsive classes and a 44 px menu toggle are source observations only.

Use a real phone or a supported device-testing environment; record browser/device, CSS viewport, date, result and defect evidence. Suggested coverage includes 360 px and 390 px portrait widths plus a tablet width; these are test samples, not universal standards.

1. Open/close the mobile menu, follow a link, and check focus/Escape using a keyboard where supported.
2. Search a billing topic, choose a suggestion, clear the query and submit an unmatched query.
3. Follow guide shortcuts; ensure headings and essential warnings are not obscured by the sticky header.
4. Read all eight deadline-record rows without clipped text or horizontal scrolling.
5. Complete the evidence checklist; change an answer and ensure the previous result is invalidated.
6. Find Contact and Privacy from the footer; verify readable text and usable links without sending patient data.
7. Check portrait/landscape and enlarged text; confirm controls, branches and warnings remain reachable.

Representative-biller task testing and measured performance/Core Web Vitals are also NOT RUN. No arbitrary word count or page quota substitutes for those checks.

## URL disposition proposal

`LEGACY_ROUTE_DISPOSITION_2026-10-31.csv` contains 318 distinct baseline paths: 311 code URLs, six sitemap static paths and one additional directory route. These are website URL identities, not an official code inventory or evidence of indexed/live pages.

Extraction basis: local `main` commit `96db67c38ae9226f1cc9e64c6565c6640783505b`, `app/sitemap.ts`, `app/lib/codes.ts`, identifiers in `app/data/full_codes.json`, and route filenames. The current remote main sitemap was also fetched and matched the inspected sitemap logic; a fresh remote full-code key-set comparison and live crawl were not performed. Reconcile Search Console/exported live URLs and actual deployed main SHA before release. Other V3 branch route patterns are not assumed to exist on live main.

Proposed decision: retain the five shared informational/home URLs with revised content. For 313 baseline directory/code paths with no equivalent published replacement, keep a genuine 404 and helpful navigation. Do not redirect those pages indiscriminately to home or a general guide. Approve this scope reduction explicitly before live release. An exact equivalent added later can receive an individually reviewed redirect.

Google Search Central's site-move guidance, directly inspected 31 October 2026, recommends proper 404/410 responses for removed content and warns against irrelevant mass redirects. It also calls for checking canonical/indexing settings and sitemaps. Source: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes — Prepare the new site / Start the site move; displayed update 20 August 2026. These recommendations support this proposal, not a ranking guarantee.

Google's noindex guidance explains that crawlers must be able to fetch a page to see its noindex instruction: https://developers.google.com/search/docs/crawling-indexing/block-indexing — opening explanation and Implementing noindex; directly inspected 31 October 2026. Noindex is not access control.

## Concrete release sequence — not executed

1. Close mobile/contact/operator/privacy gaps, resolve content-use questions for the exact public bundle, and record editorial review limits. Keep proprietary code-library content held.
2. Reconcile actual live URLs with the CSV, approve removals and any exact-match redirects, and capture the current live deployment/commit for rollback. Repository main alone is not proof of the live deployment SHA.
3. Prepare a separate release change: approved public pages indexable only in the intended production context; preview stays noindex; search and not-found remain noindex. Current root setting is hardcoded noindex, so merely merging this branch would not complete SEO setup. Update the audit with explicit production/preview cases rather than deleting its indexing assertions.
4. Verify production canonicals, sitemap, robots, required metadata, response codes, external integrations and privacy text on the final candidate. Preserve applicable Search Console verification if it exists; none is assumed configured.
5. Present the concrete commit, URL decisions, test evidence and rollback plan for live approval. Only then merge/promote. Afterward check actual domain HTTP responses, noindex absence on approved pages, search noindex, sitemap, links and missing routes. Submit sitemap through a verified Search Console account when authorized. This does not guarantee indexing or ranking.
6. If release verification fails, stop promotion or restore an approved deployment. Do not automatically restore older held-content exposure as a universal rollback; choose the approved maintenance or safe release option for the specific failure.

AdSense setup remains a later task. No account, publisher ID, ad code, consent agreement, licensing agreement or paid service was created here.
