# Netlify authenticated preview review — 8 November 2026

## Outcome

The owner established access in the testing browser. The protected deploy preview loaded successfully:
https://deploy-preview-1--denialcodepro-guide-staging.netlify.app/

This closes the earlier Netlify browser-access blocker for this review session. It does not remove project protection or guarantee access in future sessions. No authentication settings, domain, deployment configuration or live content were changed.

Tested the actual hosted preview, not only a local build or GitHub deployment status. The rendered drawer identified deploy ID `6af033cc47b2319bba157264`. The application behavior included immediate scrolling and the guide navigation additions. Exact source-commit association was not independently established in this browser pass.

## Executed browser checks

| ID | Task | Observed result |
|---|---|---|
| N01 | Protected preview access | PASS: homepage loaded instead of the invited-account sign-in screen. |
| N02 | Preview metadata | PASS: DOM robots `noindex, follow`, canonical `https://denialcodepro.com/`, computed HTML scroll behavior `auto`. |
| N03 | Homepage recommendations | PASS: “corrected claim” produced two suggested guides, correction/review first. |
| N04 | Submitted search | PASS: Enter opened results for corrected claim with two matching guides. |
| N05 | Search result pointer navigation | PASS: clicking correction/review opened that guide. |
| N06 | Correction decision shortcut | PASS: Enter focused `finding-2`; target top 96px, header bottom 65px at normal zoom. |
| N07 | Return to choices | PASS: return link focused `next-steps`, top 96px. |
| N08 | Related guides | PASS: correction → deadline → response navigation reached the correct guides. |
| N09 | Deadline record shortcut | PASS: focused `deadline-record`, top 96px. |
| N10 | Unknown/conflicting response route | PASS: focused `finding-1`, top 96px; guide-to-checklist link also opened the checklist. |
| N11 | Checklist with unknown answers | PASS: output requested response identification, applicable rule and evidence reconciliation without selecting a correction/dispute branch. |
| N12 | Stale result clearing | PASS: changing Response type removed the prior result and restored the build prompt. |
| N13 | Supported discrepancy branch | PASS: adjudicated response + identified requirement + documented discrepancy produced correction-method/claim-linkage checks and retained deadline/evidence cautions. |
| N14 | Reset | PASS: all three answers returned to unknown defaults and previous output cleared. |
| N15 | Held code search | PASS: CO-19 displayed code lookup unavailable; starting-point guides were explicitly not an interpretation of that code. |
| N16 | Compact menu | PASS: at 400% zoom, Open navigation expanded the menu; Escape closed it and returned focus to the toggle. |
| N17 | Narrow search/guide reflow and anchor | PASS: measured viewport 340 × 234 CSS px, client/scroll widths both 337px on CO-19 search and deadline guide. Conflicting-deadlines shortcut focused `finding-3`, top 96px, header bottom 73px. |

**17 grouped task checks passed; 0 failed within this listed scope.** These are direct browser observations, not 17 automated unit assertions. Do not add historical Vercel/build counts to this run.

## Additional observations and limitations

- No Google Analytics or Google Tag Manager external script element was present on the inspected preview homepage. This is consistent with preview tracking suppression; it does not prove network-wide absence or live Analytics receipt. Production measurement settings were not changed.
- The high-zoom test is browser reflow, not a phone, touchscreen or device emulation. Real-device testing of the current navigation remains unexecuted here.
- Netlify's injected preview toolbar/drawer occupied the lower part of the 234px-high zoomed screenshot. The selected heading was visible, but this prevents claiming an unobstructed full-card visual review. No Netlify protection or toolbar configuration was changed. Normal zoom was restored.
- No new medical-billing source verification, licensing clearance, independent specialist review, exhaustive accessibility audit or representative-biller usability study occurred.
- No build or existing automated suite was rerun: this step changed only review documentation, not the application. Prior executed software results remain in their dated reports.

## Live deployment finding

Read-only inspection of the owner's Netlify Projects list and the live `denialcode` overview showed:
- `denialcodepro-guide-staging`: private project; deploys from GitHub with Next.js.
- `denialcodepro.com` / project `denialcode`: latest deployment labelled “Netlify Drop”, published September 24.
- The live project overview repeated “Last deployed from Netlify Drop.”

This does not establish that no Git configuration exists elsewhere or verify a pause flag. It means a future release must not assume a GitHub merge automatically updates the live domain. Confirm the actual release target, Git/manual deployment setup, production environment, redirects and rollback method before an approved release. No settings were edited and no deploy was triggered.

## Next milestone and preserved boundaries

The earlier access blocker is resolved for this authenticated test. Remaining first-code-page gates are unchanged: intended-use rights, independent billing-specialist review, safe evidence rendering and the pilot's actual rendered-page tests. Keep CARC 19 held until those decisions are recorded.

The current preview is still a three-guide investigation website, not the completed code lookup product. No claim of AdSense approval, licence-free clearance, ranking or full launch readiness is made. No research dossiers, production data, Analytics files or Search Console verification files were modified during this step.
