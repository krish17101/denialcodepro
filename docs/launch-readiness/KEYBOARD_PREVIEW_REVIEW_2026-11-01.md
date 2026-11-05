# Deployed keyboard review — 1 November 2026

## Scope and result

Tested the deployed original-content preview after indexing-safeguard commit `363d06d753938b97d698bf72c873b0e25faf6167`. Six targeted keyboard interaction cases passed. No application defect was found in these cases, so no application or content change was made. This report and screenshot are new review evidence, not a fresh build, legal opinion or public-release approval.

Preview: https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/

Observed viewport: 1363 × 936 CSS pixels. Browser actions used the supported cloud-browser keyboard APIs and read-only rendered DOM observations. The search text was populated using the input API to establish the fixture; subsequent Tab/Enter behavior was tested. Some controls were targeted by their accessible names before pressing keys. This is not a claim of an entirely unassisted keyboard journey from the address bar, mobile emulation or a screen-reader session.

## Executed cases

| ID | Action | Observed result | Outcome |
|---|---|---|---|
| K01 | Populate homepage search with `corrected claim`; Tab from search field | Focus moved to Search button with a 3 px green focus outline | PASSED |
| K02 | Tab from Search to first suggestion; activate with Enter | Focus reached correction/review suggestion with visible outline; correct guide opened and main content received focus | PASSED |
| K03 | Activate guide's Build your evidence checklist link with Enter; use End and Tab through three native selects | Response became adjudicated, scope known, data accurate; focus advanced to Build checklist | PASSED |
| K04 | Press Enter on Build checklist | Five investigation steps displayed; focus stayed on button; result container had aria-live=polite | PASSED |
| K05 | Shift+Tab to final select; Home to unknown | Old five-step result removed immediately; explanatory build prompt returned | PASSED |
| K06 | Tab through Build to Reset; press Space | All three values restored to unknown; no old result remained; Reset retained visible focus | PASSED |

The result for K04 required investigation of decision rationale and scope, available review route, deadlines and receipt evidence; it did not promise payment. This observation verifies the rendered branch, not a new source-based review of billing instructions. A polite live-region attribute was observed; actual assistive-technology announcements were not tested.

During client navigation the first snapshot briefly lacked text while the page settled. A subsequent snapshot showed the expected complete checklist. No defect was inferred from the intermediate observation and no arbitrary wait or DOM mutation was used.

## Deployed metadata and layout observations

- Homepage robots: `noindex, follow`; canonical: `https://denialcodepro.com`.
- Checklist robots: `noindex, follow`.
- Checklist document had no horizontal overflow at the tested desktop width.
- Reset focus outline measured `rgb(5, 150, 105) solid 3px`; screenshot visually inspected.
- Existing email fallback remained visible. No feedback submission or email was sent; mailbox ownership and delivery remain unverified.

Screenshot: `evidence/keyboard-check-2026-11-01.jpg`. It shows the reset state and visible keyboard focus. There was no application modification to justify repeating the previous build, 12 policy cases, 322 production-fixture HTTP cases, six preview HTTP cases, or prior search/checklist regression suites. Their dated evidence remains in the preceding reports; those counts are not added to this review.

## Release decision

The tested desktop paths are usable and the inspected deployed pages retain the intended preview indexing restriction. Keep the preview for review. No live merge, production indexing activation, ad activation, license acceptance, research edit or code-library publication was performed.

Remaining limits are concrete:

- The supported browser interface still has no phone-sized viewport/device emulation. Mobile navigation, touch, reflow and enlarged-text cases remain BLOCKED in this environment.
- No representative-biller session, real screen-reader test, performance measurement or independent expert certification was completed.
- The website cannot establish who controls its mailbox, whether messages arrive, the actual operator/entity, or email retention practices. Those statements remain unverified; no fabricated public disclosure was added.
- Content-use review and the proposed removal of legacy URLs remain separate release decisions. Passing keyboard or indexing tests does not establish AdSense acceptance, ranking or licensing clearance.

Do not spend another cycle rerunning unchanged checks merely to increase pass counts. The next useful work is closing a specific remaining dependency, or fixing a newly demonstrated problem.
