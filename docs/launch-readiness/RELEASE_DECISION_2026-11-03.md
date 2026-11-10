# Release decision — current checkpoint

Updated 10 November 2026 (Asia/Calcutta). This supersedes the November 3 open-task list; earlier text remains in Git history. No live publication is approved or executed by this document.

## Candidate and approved scope

The tested source candidate is commit `561a6f69cfaefdbfbfe6fedad776648c1b9b33b3` on `codex/original-content-preview`. GitHub comparison to the November 10 inspected head `8eefda1f519d2f9226a838d0a0d7ca69c4200476` showed one documentation-only change. This is source comparison, not a new deployment test.

The limited scope remains three original investigation guides, an evidence checklist, guide search, and trust/contact pages. The owner already approved that scope and the legacy-route disposition in CONTENT_RELEASE_REVIEW_2026-11-03.md. Do not request that same scope approval again.

This scope does not provide a searchable code-specific CARC library. A visitor searching CO-19 cannot obtain a full code-resolution page in this release. Code-specific research remains preserved and held.

## Reconciled gates

| Previous open item | Current disposition | Supporting record / remaining limit |
|---|---|---|
| Netlify-aware indexing policy | Implemented; no longer a missing implementation task | lib/public/indexing.ts includes Netlify signals, explicit approval and conflicting-host rejection. Historical tests remain in their dated reports. Actual live release still requires production metadata verification. |
| Build lifecycle command | Implemented in repository | netlify.toml uses npm run build, which invokes prebuild/postbuild checks. Hosted execution evidence is in the private operational review; do not substitute Vercel success for Netlify evidence. |
| Staging/runtime testing | Completed within recorded scopes | Runtime-notice inspection and smoke checks completed November 9. No new browser suite ran for this documentation update. |
| Notice packaging | Corrected | netlify.toml explicitly includes public/third-party-notices.txt in function bundles. RUNTIME_NOTICE_AUDIT_IMPLEMENTATION_2026-11-09.md describes implementation and test scope. |
| Legacy-route decision | Owner-approved scope | Follow the existing route map. Verify actual domain responses after release; do not redirect unrelated retired code URLs to generic guides. |
| Software attribution and other license obligations | Qualified / unresolved | Exact client-only attribution remains open. A missing file is not proof of infringement or a paid-license requirement. Aggregate notices and tests are not comprehensive legal clearance. |
| Code-specific content | Held separately | FIRST_CODE_RELEASE_ACTIONS_2026-11-08.md describes intended-use and actual billing-review evidence. Neither is supplied by software tests. These are separate from the already-approved limited guide scope. |
| Live release | Pending exact candidate/release authorization and controlled execution | Follow LIVE_NETLIFY_RELEASE_ASSESSMENT_2026-11-09.md. Do not silently resume auto-publication or enable indexing. |
| AdSense | Not approved or predicted | Apply after a stable public site and applicable policy review. No approval, ranking or revenue guarantee. |

## Remaining sequence

1. Record a decision on remaining software-attribution/obligation questions based on adequate evidence or qualified assessment. Do not mark an unknown as verified, infer that a paid licence is necessarily required, or rewrite the framework merely to avoid documenting uncertainty.
2. Obtain explicit authorization before any public maintainer question or other external message. The draft is ready in RUNTIME_NOTICE_AUDIT_IMPLEMENTATION_2026-11-09.md; it has not been sent.
3. Complete the controlled release preparation on the existing live project under the established release plan. Preserve the existing Analytics integration and Google verification asset. A noindex staging artifact is not an indexable production artifact merely because it is promoted.
4. Present the exact production candidate and remaining qualifications at the final publication decision. Preserve rollback availability; then verify domain, canonical, robots, sitemap, intended 404s, search, contact and Analytics behavior after an authorized release.
5. Keep code-page expansion on its separate evidence/review track. Do not wait for all 71 internal dossiers to become publication-ready before assessing the already-approved limited release.

## Work not to repeat without a reason

Do not rerun unchanged search/mobile/build checks solely to increase totals. Recheck when implementation changes, a defect is found, the target artifact changes materially, or a required scope is still untested. Do not interpret owner-reported mobile testing as independent agent testing or a representative-biller study.

The privacy retention commitment remains an operational duty; editing a page does not automate mailbox deletion. Do not expose private account or billing observations in public review documents.

## November 10 execution record

- Read the actual candidate indexing policy, build scripts and existing decision records.
- Retrieved the preview branch ref; inspected head matched the saved November 9 documentation update.
- Compared tested source commit with that head; only the attribution documentation differed.
- Directly inspected public Next.js discussion #99484. It was marked Unanswered, and the visible comments did not provide an independently established authorized maintainer confirmation. Community claims were not adopted as ownership evidence.
- No application files, hosted settings, main branch, Analytics configuration, research dossiers, or source notices changed.
- No new software tests, browser checks, external messages or legal/billing-expert review occurred during this documentation-only checkpoint.
