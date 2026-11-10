# Deadline-evidence guide — checkpoint, 31 October 2026

## Scope and result

Updated `build-a-deadline-evidence-record` using the established public editorial format. Added five conditional routes, an eight-field on-page deadline record, five explanatory sections and two fictional examples. Added an optional `recordFields` property and conditional definition-list/anchor rendering; no case input, storage, download or date calculation. This is not a change to the V3 research schema or dataset.

The other two guide data records and all research are preserved. No live merge, AdSense activation or license agreement is part of this work.

## Source and claim record

Local IDs are for this review only, not production registry IDs. Three CMS manuals support limited Medicare FFS facts. Their source content was directly inspected on 31 October 2026; Chapter 34 section 10 was reused from the correction-guide research performed that day. No full source snapshot or hash was saved. PDF page references count the cover as page 1. During the source pass the Chapter 1 locator was corrected from page 185 to page 184 before publication.

| ID | Proposition | Source and precise locator | Version information | Limits |
|---|---|---|---|---|
| DE-01 | Medicare initial-filing receipt/submission requirements and a separate exception framework | CMS Chapter 1: https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c01.pdf — §§70.2–70.3, 70.7; PDF pp.184–188,190–191 | Cover rev.13725, issued 10 April 2026. §§70.2/70.3 rev.2140, issued 21 January 2011, effective 1 January 2010, implementation 22 February 2011. §70.7 rev.12909, issued 24 October 2024, effective/implementation 26 November 2024 | VERIFIED scoped facts. Receipt evidence must be matched to the relevant submission; no automatic timely-filing or payment finding. No exception applied to a real case. |
| DE-02 | Medicare redetermination timing has process-specific counting and delivery provisions; good-cause treatment distinguishes requesting parties | CMS Chapter 29: https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c29.pdf — §§240–240.3; PDF pp.15–18 | Cover rev.12423, issued 20 December 2023. Relevant sections rev.4278, issued 12 April 2019, effective/implementation 13 June 2019 | VERIFIED at the stated level. No universal weekend rule, extension approval, numerical default or cross-payer transfer. |
| DE-03 | Medicare reopening does not pause the appeal period | CMS Chapter 34: https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/clm104c34.pdf — §10, PDF p.3 | Cover rev.4219, 25 January 2019; section rev.3568, issued 29 July 2016, effective/implementation 30 September 2016 | VERIFIED scoped warning, reused from same-day direct inspection. Does not establish appeal eligibility. |
| DE-W01 | Record the exact action, applicable scope, trigger, counting method, destination, uncertainty and reviewer | Original editorial checklist and branches 1–3 | Authored 31 October 2026 | Recommendations, not mandatory submission documents. Reader must obtain the actual controlling instruction. |
| DE-W02 | Recheck an apparently missed deadline and investigate only available exceptions/routes | Original editorial branch 4 and section 4 | Authored 31 October 2026 | Conditional recommendation, not a promise of late acceptance or a new appeal right. |
| DE-W03 | Keep separate clocks and do not assume tolling or restart | Original editorial branch 5 and section 5; DE-03 supports the Medicare illustration | Authored 31 October 2026 | Other-process tolling must be established independently, not presumed absent or present. |

No official code descriptions, proprietary tables, transaction locators or licensed forms were reproduced. Limited program facts are paraphrased with source links. No blanket legal/commercial clearance is claimed.

## Separate content and usefulness review

Internal AI-assisted review, not independent billing-expert certification. Reviewed these eight issues against the final text: action versus account; initial filing versus appeal; requester/program scope; sending versus receipt; trigger evidence versus convenience; counting units and nonwork-day assumptions; unsupported exceptions/appealability; unsupported tolling/restart. No numerical deadline is supplied as a default. The guide is an evidence-organizing task, not a calculator.

Two fictional desk walkthroughs completed: conflicting notice/delivery dates require the governing trigger; an open service ticket does not establish an extension of a different process. The apparently-expired route explicitly retains the possibility that no exception or review exists. These are editorial checks, not observed user task completion. Representative-biller testing remains outstanding.

## Executed checks

Implementation commit: `cfcfd71f0b5d42bb90729ac5e61f04e751dd22d4`.

| Command/check | Actual outcome | Scope |
|---|---|---|
| `npm run build` | Exit 0; final build after locator correction | Compilation and static generation |
| `npm run typecheck` | Exit 0 | Type compatibility |
| `node scripts/test-public-search.js` | 21 passed, 0 failed | Search ranking and rendered controls; run before final locator-only correction |
| `npm run test:launch` | 25 passed, 0 failed | 18 checklist states plus 7 regressions; run before final locator-only correction |
| `python scripts/audit-built-pages.py` | 13 generated pages passed, plus exact sitemap/robots checks | Static structure, links, metadata and anchors |
| `node scripts/check-publication-boundary.js --built` | 5 passed, 0 failed; 97 artifacts | Route/dependency boundary and sampled content scan |
| `git diff --check` | Exit 0 | Whitespace |
| Parsed-guide assertions | 4 passed | Other two records unchanged, identities unchanged, sources resolve uniquely, checklist fields nonempty/unique |
| Generated HTML record check | Passed on all three guide pages | New record is rendered only on deadline guide, with eight semantic term/description rows |
| Research hash/key comparison | 144 files unchanged, preserving the 71-dossier baseline | Existing corpus preservation |

Software checks do not establish factual accuracy or legal clearance. The preservation method is reproduced in CLAIM_RESPONSE_GUIDE_REVIEW_2026-10-30.md; final build output is at workspace-relative `launch_work/deadline-checkpoint/build.txt`. The initial successful build preceded a source-locator correction; the final build was rerun for the changed content. No tests were weakened.

## Preview follow-up

Vercel reported success for implementation commit `cfcfd71f0b5d42bb90729ac5e61f04e751dd22d4`: https://vercel.com/krish17101s-projects/denialcodepro/4GrZeKkEEM3pxfH4w8XzitCECNzL . Preview opened and inspected on 31 October 2026:
https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/guides/build-a-deadline-evidence-record

Five targeted desktop browser checks passed at 1363 × 936:

1. Loaded revised title, five routes, eight checklist fields, two examples and three CMS references.
2. Clicked Deadline record: matching fragment and section top at 96 px; eight semantic terms, no case-input controls. Saved screenshot visually inspected; table text readable.
3. Clicked First check: section top at 96 px, deadline-calculator limitation, urgency instruction and Medicare scope warning present and expanded.
4. Clicked Sources and limits: section top at 96 px; three expected CMS links and precise locator notes present. Source bodies were checked in the research pass, not re-fetched during this navigation test.
5. DOM layout/indexing check: no horizontal overflow at this desktop viewport; robots `noindex, follow` retained.

Screenshot: `evidence/deadline-guide-2026-10-31.jpg`. Browser binding from the previous context was unavailable; a fresh preview tab was opened. No page defect was inferred from that session-recovery limitation.

Mobile testing remains unavailable in the present browser API; responsive CSS is not a mobile pass. No representative-biller usability session or independent expert review occurred. These checks establish the observed desktop behavior, not production, AdSense or legal approval.

## Next release checkpoint

All three planned guide refinements now have implementation and desktop review records. Continue with remaining release dependencies: mobile-device verification, owner-confirmed operator/contact/privacy facts, a verified contact delivery route, and the legacy-route/indexing transition plan. Keep the preview noindex and the research corpus held. A production release requires the tested preview and concrete release decision; no merge or live deployment was performed here.
