# Launch scope and legacy URL decision — 3 November 2026

Decision requested, not a production release approval. Netlify remains paused; no production or route changes made in this review.

## Recommendation
Approve a limited first release of the three investigation guides, evidence checklist and supporting pages, subject to remaining rights/content review and Netlify validation. Describe it honestly as investigation guidance, not a working code-reference library. Do not submit for AdSense merely because technical tests pass. Code-specific content remains a separate, source- and rights-reviewed milestone.

This recommendation prioritizes a bounded useful release and avoiding publication of the held corpus. It is not a conclusion that all current or future material is license-free. It does not certify the existing live code pages as lawful or unlawful.

## Actual candidate
- Three guides: find-the-claim-response; choose-a-correction-or-review; build-a-deadline-evidence-record.
- Evidence checklist and topic search; search intentionally does not return code dossiers.
- Sitemap contains 13 intended content URLs: home, guides index, checklist, About, Contact, Methodology, Sources, Privacy, Terms, Disclaimer and the three guides. Search is outside the sitemap and noindex. The 14-page static audit includes the not-found page, not 14 substantive articles.
- Homepage already states that the code-reference library is not included. SearchBox and lib/public/search.ts implement the code-query limitation. For example CO-19 will not show a full explanation or resolution dossier.

## Baseline route reconciliation executed
Read LEGACY_ROUTE_DISPOSITION_2026-10-31.csv from identified local main baseline 96db67c38ae9226f1cc9e64c6565c6640783505b: 318 rows; 318 unique paths; five proposed retained 200 paths; 313 proposed 404 paths. Those 313 comprise 311 /code/ paths plus /adjustment-codes and /denial-codes. Counts describe baseline URL identities, not unique official codes or current indexed URLs.

Retained: /, /about, /privacy-policy, /terms, /disclaimer. No equivalent code explanation exists in the candidate, so no code-to-guide redirect is justified. app/not-found.tsx offers guide/checklist navigation while explaining scope. No redirect or disposition approval flag was changed in this review.

## Consequences and alternative
Limited launch removes the old code lookup. Visitors following those URLs will reach a genuine not-found response with navigation, not a substitute answer to their code question. Any existing search visibility associated with removed pages may be lost; traffic magnitude is unknown because Search Console and analytics evidence were not available. Do not imply that 404s preserve page rankings or are harmless to traffic.

Alternative: delay replacing the live site while preparing a small rights-cleared, evidence-reviewed code-specific release. This is closer to the eventual code-search promise but delays the new site and does not resolve any concerns in the existing live corpus. Do not automatically restore all 311 routes or publish placeholder text just to keep URL counts.

For an approved limited launch, retain the 313 proposed 404 dispositions until an actually equivalent reviewed page exists. Reassess each URL individually when content becomes available. Do not redirect every old code URL to the homepage or a generic guide.

## Authoritative basis inspected
- Google Search Central, How to move a site; Prepare the new site / Provide errors for deleted or merged content and Start the site move / Avoid irrelevant redirects; updated 20 August 2026, accessed 3 November 2026. https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes . Supports true 404/410 for removed content and avoiding irrelevant mass redirects; does not quantify this site's traffic impact.
- Google AdSense Help, Make sure your site's pages are ready for AdSense; original content, navigation and unique content sections; no publication date established, accessed 3 November 2026. https://support.google.com/adsense/answer/7299563 . Supports useful original content and clear navigation; does not guarantee approval for three guides or prescribe a universal article count.

## Current-run verification
Read app/page.tsx, app/sitemap.ts, app/not-found.tsx, app/components/v3/SearchBox.tsx, lib/public/search.ts and baseline CSV. Executed node scripts/test-public-search.js: 21 passed, zero failed, including code-query scope and guide-only suggestions. CSV parsing found counts above and no duplicate paths. These are source/structural checks, not a new browser, live crawl or Netlify HTTP test. No build rerun because only documentation changed. Previous test results remain historical.

## Other release gates
Netlify source-level preparation is complete in commit a991b85015ebf4d9d121a60f909b4c11231d7a7d; hosted runtime, headers and actual configuration still require validation. This supersedes the two source-level tasks in RELEASE_DECISION_2026-11-03.md, not its remaining release gates. Mobile pass is owner-reported. Rights/content review, legacy disposition approval and exact production commit/rollback approval remain pending.

## Approval requested
Approve the limited first-release scope and the proposed retirement of 311 code URLs and two directories, or hold the replacement until a small reviewed code-specific set is ready. This approval would select the release scope only, not resume Netlify, merge main or activate ads.
