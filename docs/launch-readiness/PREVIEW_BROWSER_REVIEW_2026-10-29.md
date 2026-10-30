# Preview browser review — 29 October 2026

## Scope and result

Actual authenticated Vercel preview tested using the browser, not a local substitute. Base deployment: commit `39292d026a8362a0ed63496d79306f69d18db283`, confirmed Vercel success. One search interaction defect found and fixed in `f2fe51779d70bae6dc9e4c2cfe42e69b80a61b10`. No production merge, live-domain change, research edit, ads, or new code-library content.

Preview: https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/

Authentication initially blocked the walkthrough. The owner completed secure Vercel/GitHub sign-in. The final secure authentication call returned submission_failed, but a fresh browser observation showed the actual preview homepage. Successful access is based on that visible result, not the authentication tool status. No credentials or device-verification values were recorded.

## Browser page coverage

13 of 13 linked application routes opened and their page titles, H1s, rendered text, preview noindex and desktop overflow were inspected. Each had one H1 and no horizontal document overflow at a measured 1363 CSS-pixel viewport. This is not an HTTP-status audit or a mobile-device test. The error route was covered by the separate static-build audit, not a new browser visit.

Routes: `/`, `/guides`, `/tools/evidence-checklist`, `/search`, `/about`, `/guides/find-the-claim-response`, `/guides/choose-a-correction-or-review`, `/guides/build-a-deadline-evidence-record`, `/sources`, `/methodology`, `/privacy-policy`, `/terms`, `/disclaimer`.

Browser observations: `evidence/preview-page-observations-2026-10-29.json`. This contains public rendered content and measurements, not authentication data. Source and legal pages were inspected for rendering and disclosures; this does not constitute new legal clearance or factual certification of every claim.

## Interactive cases

| ID | Action | Observed result | Initial outcome |
|---|---|---|---|
| B01 | Type corrected claim on homepage | Three inline suggestions; correction/review guide first | PASSED |
| B02 | Click Search | Search page retained corrected claim and showed related guides | PASSED |
| B03 | Search CO-29 with Enter | Explicit code-library-unavailable notice; generic guides not called code interpretations | PASSED |
| B04 | Search pancakes | No matching guide; fallback clearly labeled | PASSED |
| B05 | Clear query and submit | Old unmatched result remained because empty submission was cancelled | FAILED; fix and retest below |
| B06 | Build checklist with unknown defaults | Missing-fact investigation route displayed | PASSED |
| B07 | Change response type after result | Previous checklist removed and build prompt returned | PASSED |
| B08 | Adjudicated, scope known, data accurate | Rationale and available review-route investigation displayed | PASSED |
| B09 | Reset checklist | All three defaults restored; old result removed | PASSED |
| B10 | Activate Skip to main content using Enter | Active element was MAIN with id main-content | PASSED |

Initial interactive result: 9 passed, 1 failed. A label-based automation selector for a checklist dropdown did not resolve; the visible DOM identified the combobox and the role-based interaction succeeded. This selector issue is not classified as an application failure.

## Fix

Removed the empty-query preventDefault handler from SearchBox. Empty submissions now use the same native GET form as other searches, so the existing empty-query result can render. Removed the unused input ref. No search result fabrication or changes to available guide content. The exact local staged tree matched the GitHub tree before the fix commit.

## Automated checks rerun after the fix

- `node scripts/test-public-search.js`: 21 passed, 0 failed (server rendering/search logic).
- `npm run build`: exit 0.
- `npm run typecheck`: exit 0.
- `node scripts/check-publication-boundary.js --built`: 5 passed, 0 failed; 97 artifacts inspected.
- `python scripts/audit-built-pages.py`: 13 generated pages passed; robots/sitemap assertions passed.
- SHA-256 comparison with the research baseline: 144 unchanged files; 71 dossier files counted.

The prior 25 checklist regression checks were not rerun in this browser-review turn and are not added to its test total. Browser checks above directly tested selected checklist interactions. Automated results are not medical-billing, licensing or AdSense approval.

## Remaining checks

- Mobile viewport, touch behavior and mobile menu: NOT RUN. No viewport-resizing/emulation control is advertised by the available browser API. Responsive source inspection does not substitute for this test.
- Print output/dialog: NOT RUN; button presence observed only.
- Real screen-reader behavior, representative-biller task completion and performance/Core Web Vitals: NOT RUN.
- Email delivery: NOT RUN. Preview shows mailto fallback; no message sent.
- Browser console sample included extension-origin metadata errors. No application cause was established; this is not a clean-console certification.
- Owner/privacy facts, code-content permissions, Google site/account approval: remain outside this software walkthrough.

## Next release decision

The desktop preview is suitable for continued review once the search fix retest passes. Do not represent it as mobile-certified, fully release-approved, a complete code library, or AdSense-approved. Before public launch, complete the remaining device checks and owner/privacy review, then decide on the narrow original-guide release. Code-specific drafts remain held under the existing rights/evidence review.

## Deployed fix retest

Recorded after observing the replacement deployment below.

### 30 October 2026 — completed

Deployment `f2fe51779d70bae6dc9e4c2cfe42e69b80a61b10` had reported Vercel success. The first reload attempt on 29 October was blocked by automatic approval review because of the browser usage limit; it was not executed and no workaround was attempted. On the owner's continuation request on 30 October, a new authorized browser tab opened the preview successfully.

B05 retest: entered `pancakes`, submitted with Enter, observed “No matching guide found”; cleared the field, pressed Enter, observed URL `/search?q=` and “Browse the available guides,” with all three guide links. **PASSED.** The previous unmatched result no longer remained. Evidence screenshot: `evidence/search-retest-2026-10-30.jpg`.

Final result across the ten defined interactive cases: **10 passed after one fix** (nine on 29 October; B05 retested on 30 October). These were not all rerun on 30 October. The 13-route walkthrough remains dated 29 October. No new application changes were needed for this retest. Remaining checks above stay NOT RUN; this result does not approve mobile behavior, code-content rights, public release or AdSense.
