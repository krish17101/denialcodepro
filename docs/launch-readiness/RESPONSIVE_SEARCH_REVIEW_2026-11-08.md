# Responsive search and guide review — 8 November 2026

## Result and scope

Application commit: `1c79ec3ec8e57d15c7478f02c678a93dc6e03cc0`, branch `codex/original-content-preview`.
This completes the current high-zoom keyboard and reflow checks, not release approval or real-device certification.

The CSS change uses immediate anchor scrolling instead of smooth animation. Earlier high-zoom keyboard activation landed the correction card partly above the fixed header; an isolated retry had worked. Smooth-scroll timing was a possible explanation, not a proven root cause. After this change, the tested first activations consistently positioned targets 96 CSS pixels from the top, below the 73-pixel header.

GitHub comparison against `5365ebfa2ead7b16e9775242af296072d3610d1c` confirms that the application commit changes only `app/globals.css` (two additions, one deletion). No guide text, research dossier, analytics configuration or Search Console verification asset was changed by that commit.

## Browser method

Observed Vercel branch preview:
https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/

Chrome browser zoom 400%; measured viewport width 340 CSS pixels, document client width 337. This is a high-zoom reflow and keyboard test, not device emulation. Browser policy disallowed DevTools, so device emulation was not attempted further. Normal zoom was restored at completion (viewport 1363px).

The browser initially had an unrelated blank tab selected. Zoom commands there did not change the target site's width; after selecting the target tab, the 340px viewport was measured. Only measurements from the selected target are counted.

## Browser task results

These are direct observations from this review, separate from historical tests.

| ID | Task | Result and observed evidence |
|---|---|---|
| B01 | Deployed scrolling style | PASS — computed HTML scroll behavior was `auto`. |
| B02 | Narrow-layout reflow | PASS — homepage, all three guides and CO-19 search showed document scroll width equal to client width (337px), with no horizontal document overflow. |
| B03 | Homepage suggestions | PASS — “appeal deadline” produced three suggestions; the deadline guide appeared first. |
| B04 | Submit and open search result by keyboard | PASS — Enter produced `/search?q=appeal+deadline`; Enter on the deadline result opened the correct guide. |
| B05 | Deadline-guide shortcuts | PASS — conflicting-instructions route focused `finding-3`; deadline-record link focused `deadline-record`; both targets at top 96px. |
| B06 | Related-guide navigation | PASS — keyboard activation opened deadline → correction → response guides. |
| B07 | Correction-guide regression | PASS — first keyboard activation focused `finding-2`, top 96px, header bottom 73px. Screenshot inspection showed the heading visible below the header. |
| B08 | Return and detail navigation | PASS — return focused `next-steps`; detail link focused `check-5`; both top 96px. |
| B09 | Response-guide unknown route | PASS — uncertain/conflicting-response link focused `finding-1`, top 96px. |
| B10 | Unpublished code search | PASS — CO-19 returned “Code lookup is not available yet” and explicitly said suggested guides do not interpret that code. No held draft was exposed. |
| B11 | Compact menu | PASS — Open navigation expanded Mobile navigation; Close navigation collapsed it. |
| B12 | Normal-zoom pointer link | PASS — after restoring normal zoom, clicking the deadline guide in the code-search starting points opened the correct guide. |
| B13 | High-zoom pointer result link | INCONCLUSIVE — one pointer activation of the deadline result left the search page and URL unchanged. Keyboard activation succeeded. This pointer interaction is not counted as a pass and its cause was not established. |

Count for this table only: **12 passed, 1 inconclusive**. B02 and B05 are grouped tasks, not individual automated assertions. Do not mix these totals with earlier desktop or software-test counts.

The short 234px-tall zoomed viewport exposed only part of long cards vertically; this requires ordinary vertical scrolling. No claim of full WCAG compliance, representative biller usability testing, or touch-device validation is made.

## Software and deployment checks

Executed after the CSS change in the local candidate:
- `npm run build`: completed successfully, including TypeScript and publication-boundary checks. Postbuild: 5 passed, 0 failed; 111 build artifacts inspected; description sentinel scan is sampled.
- `python3 scripts/audit-built-pages.py`: 14 generated HTML pages passed, 0 failed; robots/noindex compatibility and exact sitemap coverage passed.
- Execution outputs retained alongside this report in `evidence/responsive-build-2026-11-08.log` and `evidence/responsive-html-2026-11-08.log`. These logs were generated during the resumed change cycle, not rerun to manufacture a new timestamp.
- GitHub status read on 8 November: Vercel success; Netlify staging deploy-preview success for application commit 1c79ec3.
- The previous 25 launch and 18 analytics test passes are documented in the 7 November review. They were **not rerun** for this CSS-only change and are not included in current counts.

Deployment success does not mean every browser interaction passed.

## Remaining limits

- Netlify staging and deploy-preview browser access: BLOCKED by invited-team sign-in. No protection settings changed. Vercel results do not prove Netlify browser behavior.
- Real mobile/touch testing of the new navigation: NOT RUN in this environment. Earlier owner mobile testing predates these changes.
- High-zoom pointer result activation: unresolved as recorded in B13; targeted real-device/pointer retest is needed before marking all navigation interactions passed.
- No new medical-billing source review, intended-use rights clearance, legal assessment or independent billing-specialist review occurred.
- CARC 19 remains internal and held. This website still has three public investigation guides, not a completed code-lookup catalogue. AdSense readiness or approval is not established by these checks.

## Preservation and next milestone

No live-domain release, main merge, AdSense account setup, hosting protection change or research conversion was performed. The production site was not modified. Analytics and verification files are outside the sole application diff; this does not confirm Google account ownership or live event receipt.

Next milestone: resolve the narrow-pointer/real-device check and Netlify preview access, then complete the held pilot's intended-use and billing-specialist review before enabling any code-specific page. Keep the guide-only preview distinct from the planned code-search product. Obtain explicit owner approval for a reviewed live release.

## Follow-up pointer test — 8 November 2026

A new browser session reproduced the automated locator click remaining on the search page at 400% zoom (340 × 234 CSS px). The result link was visibly clear of the sticky header: link bounding rectangle top 95.25px, bottom 138.5px; header bottom 73px. Read-only hit testing over visible text returned the intended anchor. A direct desktop-pointer click on that visible text opened the correct deadline guide. Normal zoom was restored.

**B13 follow-up: direct-pointer navigation PASS; automated locator-click anomaly retained.** No application defect or exact automation cause was established, so no additional source change was justified. The original 12-pass/1-inconclusive table remains the historical first-pass record; this follow-up adds one direct-pointer task pass, not a rerun of the whole suite. Real touch-device testing and Netlify authenticated browser verification remain outstanding. No build was rerun for this documentation-only follow-up.
