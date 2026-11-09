# Preview provenance, build prerequisites and notice correction

9 November 2026 (India time). No live deployment or hosting setting changed.

## Hosted observations completed

The previously browser-tested Netlify artifact `6af033cc47b2319bba157264` is explicitly associated in its deploy detail with commit `ac6ff38d059b6803b1d058d2f9bcc3523d547ae4`, PR #1, branch `codex/original-content-preview`. This closes the source-association gap in NETLIFY_AUTHENTICATED_REVIEW_2026-11-08.md. The deployment-specific URL, not the moving PR alias, identifies this evidence.

GitHub comparison from that commit to branch head `4ab5b33e2889dcf0d58b1a0949ad1ce0c0e97fab` showed three commits touching only two review documents. Application code at that head therefore matched the tested artifact. The notice change in this checkpoint is subsequent and has not yet been inspected on a hosted build.

Directly inspected deploy detail/build log:
- Context `deploy-preview`; Next.js 15.5.28; Netlify Next.js runtime 5.15.1; Netlify Build 37.7.6.
- `npm run build` executed the prebuild collector and boundary checks, type checking and postbuild boundary checks. Hosted log records two prebuild and five postbuild checks passing. These are November 8 build results inspected today, not tests rerun today.
- Notice generator logged 682 records, 652 installed, 100 installed without root notice and 294 distinct notice texts. Different installed counts from the local Linux fixture must not be combined.
- One server handler bundled; two redirect rules and one header rule processed. Rule contents were not inspected here.
- Runtime log reports version 5.16.6 available. No upgrade performed; an update notice alone is not a confirmed vulnerability or release defect.

Sources: Netlify authenticated UI, https://app.netlify.com/projects/denialcodepro-guide-staging/deploys/6af033cc47b2319bba157264 and GitHub compare API for the two commits above.

The deployed `third-party-notices.txt` was opened successfully through existing team protection at https://6af033cc47b2319bba157264--denialcodepro-guide-staging.netlify.app/third-party-notices.txt . Inspected text contains Inter, Next.js, React, React DOM, Lucide, the Netlify plugin, sharp and sharp-libvips supplier notices. It did not explicitly label @next/env or client-only. This is selected-component verification, not exhaustive legal clearance.

The Functions UI lists a Next.js server handler but exposes logs rather than a downloadable package in the inspected view. It is scoped to the current PR preview, not necessarily the historical artifact. The hosted handler's full payload and attribution completeness remain unverified; the local adapter fixture is not substituted as evidence of deployed contents.

## Current release prerequisites

- Team Usage & billing displayed 226.8 of 300 credits remaining (rounded overview: 227), billing period October 23–November 22. No build was currently running. This observation supersedes treating September's skipped-credit messages as a current block; it does not guarantee future capacity. No purchase or plan change.
- Live project `denialcode` Environment variables UI displayed “No environment variables set for this project.” This is a custom project-variable observation, not absence of platform-provided build signals. Production indexing approval has not been configured. No secrets were revealed or variables added.
- Repository remains unlinked as established earlier. New Git build settings and production context still need the controlled setup and exact-artifact approval recorded in LIVE_NETLIFY_RELEASE_ASSESSMENT_2026-11-09.md.

## Narrow notice correction

The installed @next/env 15.5.28 manifest declares MIT, identifies `vercel/next.js/packages/next-env`, and bundles its dependencies using ncc. Its published files omit a root license. The compiled file includes a dotenv 16.3.1 manifest declaring BSD-2-Clause. The collector did not find these missing files automatically.

Directly inspected upstream sources on November 9:
1. https://github.com/vercel/next.js/blob/v15.5.28/packages/next-env/package.json — package version, source path and declared license; build dependencies include dotenv 16.3.1 and dotenv-expand 10.0.0.
2. https://github.com/vercel/next.js/blob/v15.5.28/license.md — exact repository MIT notice, copyright Vercel 2025.
3. https://github.com/motdotla/dotenv/blob/v16.3.1/LICENSE — exact versioned BSD notice, copyright Scott Motte 2015.

Added `notices/next-env-15.5.28.txt` preserving the inspected notice texts and their source URLs. The existing collector now includes it in the generated public notices and refuses a different @next/env version until the supplemental source is reviewed. No code description, medical assertion, application route or dependency version changed.

This correction does not certify all bundled dependencies. The attempted version-specific dotenv-expand license retrieval failed; its exact notice remains open. client-only 0.0.1 declares MIT but its exact applicable attribution remains unresolved. Search results containing third-party discussion claims were not adopted as authoritative ownership evidence. No owner/year was invented. Keep these bounded questions visible rather than treating the 100 missing root files as 100 proven violations or as 100 cleared packages.

## Tests executed for this correction

From `analytics_candidate`:

```text
node scripts/collect-notices.cjs
{"records":682,"installed":654,"installedWithoutRootNotice":100,"distinctNoticeTexts":295}
node scripts/test-supplemental-notices.cjs
PASS supplemental notice delivered without truncation
PASS existing font, Next and React notice texts retained
PASS mismatched package version rejected before public output write
3 passed, 0 failed; notice assembly only, not factual or legal certification
```

Both commands exited 0. The installed-root counts exclude the separate supplemental file and are not a closure metric. No full build/UI suite rerun: the change affects only notice generation and its regression check. Hosted regeneration of the new notice text remains to be checked. No independent legal or billing review occurred.

## Scope preserved and next action

Only the supplemental text, collector, targeted test and this report are changed. Public notice output is generated, not committed. Existing research dossiers, Analytics, Search Console verification, guide wording, main branch and live hosting remain untouched; no new whole-tree preservation hash claim is made.

Next: resolve the remaining specific package-notice questions and validate the newly generated notices on the exact candidate. The prior scope approval is retained. A final live release still requires exact-artifact approval; CARC 19 rights and billing-review gates remain separate and open. Do not repeat the completed 17 browser tasks unless affected behavior changes.
