# Correction versus review — checkpoint, 31 October 2026

## Change and scope

Updated only the `choose-a-correction-or-review` record in `lib/public/guides.ts`, using the existing optional source/date fields and renderer. Five conditional routes, six investigation sections, two fictional examples and three precise CMS references replace the earlier short treatment and single hub link. No application behavior, V3 schema, production dataset, research dossiers, live branch or ads changed. Implementation commit: `4bcfa9c9eaf371a968fb53932310017de986c095`.

## Evidence record

Directly inspected on 31 October 2026. Local IDs are review identifiers, not production registry IDs. Publication, section revision and access dates are distinct; no complete source snapshot or hash was captured.

| ID | Assertion and authority | Exact locator | Version context | Assessment and limits |
|---|---|---|---|---|
| CV-01 | The unprocessable-return distinction and status-dependent correction channels, under CMS Chapter 1 | https://www.cms.gov/regulations-and-guidance/guidance/manuals/downloads/clm104c01.pdf — §§80.3.1–80.3.2, PDF pages 217–219 | Cover rev. 13725, issued 10 April 2026. §80.3.1 rev.1588, issued 5 September 2008, effective/implementation 18 August 2008. §80.3.2 rev.4388, issued 6 September 2019, effective/implementation 7 October 2019 | VERIFIED within those Medicare instructions. Specific edits can have different handling; not a blanket rule for every rejection. |
| CV-02 | Reopening/appeal separation, clock warning and Part A adjustment distinction, under CMS Chapter 34 | https://www.cms.gov/Regulations-and-Guidance/Guidance/Manuals/downloads/clm104c34.pdf — §§10, 10.4, 10.4.1, PDF pages 3 and 5–6 | Cover rev.4219, 25 January 2019. §§10/10.4 rev.3568, issued 29 July 2016, effective/implementation 30 September 2016. §10.4.1 rev.1069, issued 29 September 2006, effective/implementation 29 November 2006 | VERIFIED within Medicare FFS; method and eligibility remain claim-dependent. No reopening guarantee. |
| CV-03 | Redetermination's role, requester qualification and written process | CMS: https://www.cms.gov/medicare/appeals-grievances/fee-for-service/first-level-appeal-redetermination-medicare-contractor — opening paragraph; request instructions; dismissal grounds | Page modified 10 March 2026; effective date not displayed | VERIFIED for the scoped process. Does not establish an appeal right for every adjustment or a commercial provider-dispute route. |
| CV-W01 | Compare the reported value, service record and received/processed information before selecting a route | Original editorial workflow: first check; branches 1–3; section 1 | Authored 31 October 2026 | Recommendation, not a mandatory CMS evidence checklist. Actual case facts remain unknown. |
| CV-W02 | Obtain applicable rule, requester eligibility, channel, trigger and evidence; escalate missing facts/conflicts | Original editorial workflow: branches 4–5; sections 4–5 | Authored 31 October 2026 | Recommendation, not an invented deadline or appeal right. Other-payer distinctions are scope cautions, not researched payer policies. |
| CV-W03 | Confirm the result and assign recurring problems to their responsible process | Original editorial workflow: section 6 | Authored 31 October 2026 | Suggested control, not a legal retention requirement or payment promise. |

No proprietary code descriptions, code tables, EDI field specifications or numerical deadline calculator were added. Sources are linked, with limited original paraphrases of relevant program instructions. No new license agreement accepted; this is not blanket commercial-use or legal clearance.

## Content self-review

Internal AI-assisted review; no independent human certification. Reviewed the final record against the inspected passages. Eight checkpoints:

1. Return/rejection is not automatically treated as an appealable decision.
2. Reporting error requires service-record support; accurate data is not changed to seek payment.
3. Processing discrepancy is a hypothesis until matched records establish it.
4. Minor corrections do not all receive one universal method; Part A distinction preserved.
5. Medicare clock warning is visible in the first-check panel, not hidden in an expander.
6. Review eligibility, requester, effective policy and submission requirements must be established.
7. No universal deadline, patient-billing permission, code pairing or guaranteed result added.
8. Adjacent citations support the factual sections; editorial recommendations remain labeled separately.

All eight reviewed. No substantive contradiction found within these limited assertions. This is not proof of all payer requirements. Two fictional desk walkthroughs were also completed: confirmed date-entry mismatch leads to validation/status-dependent correction; disputed policy scope leads to evidence and review-route investigation. Each retains an unsupported-finding route. No representative-biller test or task-completion metric was collected.

## Executed software and preservation checks

| Command/check | Actual result | Scope |
|---|---|---|
| `npm run build` | Exit 0 | Build and static generation |
| `npm run typecheck` | Exit 0 | Type compatibility |
| `node scripts/test-public-search.js` | 21 passed, 0 failed | Ranking, search boundaries, rendered controls |
| `npm run test:launch` | 25 passed, 0 failed | 18 checklist cases plus 7 regressions |
| `python scripts/audit-built-pages.py` | 13 generated pages passed; sitemap/robots checks passed | HTML structure, metadata, links and anchors |
| `node scripts/check-publication-boundary.js --built` | 5 passed, 0 failed; 97 artifacts | Held-content route/dependency boundary plus sampled content scan |
| `git diff --check` | Exit 0 | Whitespace |
| Before/after parsed guide comparison | 3 assertions passed | Other two records unchanged; same guide identities; citation destinations unique |
| Research SHA-256 key/hash-map comparison | 144 files unchanged; 71 dossiers counted | Preservation against existing baseline |

The build's postbuild boundary check also ran; it is not counted as an additional independent set of five tests. None of these software checks establishes factual, legal or AdSense approval. The exact preservation method is recorded in CLAIM_RESPONSE_GUIDE_REVIEW_2026-10-30.md. Local build output: `launch_work/correction-checkpoint/build.txt` relative to the workspace root.

## Browser and release status

Vercel reported implementation deployment success: https://vercel.com/krish17101s-projects/denialcodepro/3cTu6ntjfkeFgYLCVRTvQ68LkM1N

Four targeted desktop browser checks executed on 31 October 2026:

1. PASS — updated page loaded with the 31 October date, five branches, two examples and three adjacent source links.
2. PASS — Examples shortcut reached `#examples`; settled heading at 96 px from viewport top.
3. PASS — First check shortcut reached `#first-check`; section at 96 px. Medicare clock warning visible and not collapsed.
4. PASS — no horizontal overflow at 1363 × 936 CSS pixels; preview `noindex, follow` retained.

Other shortcuts were checked for valid targets by the generated-page audit; they were not all clicked again in this pass. Screenshot: `evidence/correction-guide-2026-10-31.jpg`.

Verified preview URL: https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/guides/choose-a-correction-or-review

Mobile-device testing, representative-biller usability and independent subject-matter review remain open. No screen-reader or mobile pass is claimed. Production publishing is not part of this checkpoint. Next content task: refine the deadline-evidence guide; preserve existing rights, privacy/contact and live-release dependencies.
