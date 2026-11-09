# Runtime notice audit: implementation and local validation

9 November 2026. Scope: build tooling on `codex/original-content-preview`.

## Changes

- Recovered and retained the exact dotenv-expand 10.0.0 BSD-2-Clause notice from https://github.com/dotenvx/dotenv-expand/blob/v10.0.0/LICENSE in the supplemental @next/env notice document.
- Added a read-only Netlify onPostBuild inventory for packed function ZIPs. It reports archive and file-manifest hashes, package declarations, package-root notice presence, notice paths, and separately identified combined notice documents.
- The audit runs for pull-request previews and the explicitly named staging host. Live production contexts are excluded.
- The generated public/third-party-notices.txt is explicitly included in function packages using Netlify's documented included_files setting. Source inspected 9 November 2026: https://docs.netlify.com/build/functions/configuration/#bundle . This is packaging preservation, not a legal conclusion.
- The inspector does not extract archives or modify their contents. Only bounded package metadata and notice inventory are printed. Failed inventory execution fails an enabled build.
- Package declarations and notice presence are evidence, not a legal-compliance certification.

## Local validation actually executed

| Command | Latest executed result | Limitation |
|---|---|---|
| `node scripts/test-runtime-notice-context.cjs` | 7 passed, exit 0 | Mocked subprocess. Includes live apex, live Netlify host, missing identity, similar hostname and local-context exclusions. |
| `python3 scripts/test-runtime-notice-audit.py` | 7 passed, exit 0 | Synthetic ZIP fixtures. Includes corruption, duplicates, traversal, no mutation, missing notice, missing archive and separate combined-notice reporting. |
| `node scripts/test-supplemental-notices.cjs` | 3 passed, exit 0 in the preceding implementation checkpoint | Supplemental assembly and version guard only; not rerun for the later audit-only changes. |

Do not combine previous six-test inspector results with the expanded seven-test suite as unique coverage. No unrelated mobile or search tests were rerun for these tooling changes.

## Interpretation and limits

A missing root LICENSE filename does not by itself establish a violation: notices can be provided separately. A combined notice filename does not prove that every applicable obligation is satisfied. The audit does not inspect legal sufficiency, embedded copyright statements, source-offer obligations, or the accuracy of medical-billing content.

Precise attribution for client-only 0.0.1 remains an unresolved source question. Its MIT package declaration alone must not be treated as the exact applicable copyright notice. No owner or year has been invented.

No application UI, guide text, research dossier, Analytics identifier, search verification asset or live hosting setting was changed in this follow-up.

## Operational evidence

Keep private hosting/account observations separate from this public implementation note. Hosted checks must identify the actual build and distinguish an enabled audit from a skipped context; local tests alone do not establish a successful hosted inventory.


## Focused client-only source review — 9 November 2026

Disposition: PARTIALLY VERIFIED. Package identity and declared MIT license are supported; an exact package-specific copyright/permission notice remains UNVERIFIED. This is an evidence gap, not a finding of infringement, proof of a paid-license requirement, or legal clearance.

### Evidence actually inspected

| Evidence | Locator/version | Finding and limitation |
|---|---|---|
| Installed package and lockfile | node_modules/client-only/package.json; package-lock.json packages.node_modules/client-only | Version 0.0.1, MIT declaration, exact npm URL and SHA-512 integrity recorded. Installed directory has package.json, empty index.js and error.js; no LICENSE file. No fresh npm tarball was downloaded or integrity-verified during this review. |
| Official release-tagged Next manifest | https://github.com/vercel/next.js/blob/v15.5.28/packages/next/src/compiled/client-only/package.json | Directly retrieved: version 0.0.1 and MIT; React homepage/issue links. Those links do not establish a copyright holder. |
| Official release-tagged error module | https://github.com/vercel/next.js/blob/v15.5.28/packages/next/src/compiled/client-only/error.js | Directly retrieved; boundary-marker error behavior. No copyright notice in the retrieved file. |
| React RFC 227 | https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md ; Poisoned Imports; stated start date 2022-10-11 | Directly retrieved: documents the published marker packages and conditional exports. Design provenance is not package-specific license attribution. |
| Current Next documentation | https://nextjs.org/docs/app/getting-started/server-and-client-components ; Preventing environment poisoning; displayed updated date 2026-10-05 | Directly inspected: describes optional direct installation and internal import handling. Current documentation presents v16.4.5; it must not alone establish behavior of locked v15.5.28 or justify deleting a transitive dependency. |
| Local dependency relationship | node_modules/styled-jsx/package.json dependencies.client-only | styled-jsx declares client-only 0.0.1. No dependency or boundary behavior was removed. |
| Source-access limits | npm package page and version registry URL | Direct npm page retrieval returned 403; registry URL was inaccessible to web retrieval. Search snippets and third-party attribution tables were not promoted to verified copyright evidence. |

Local installed-file SHA-256 observations:
- error.js (144 bytes): 7d211552731db17e1ff8635eea0970ef57ecc91b04b95536b9fa5abbfafaec26
- index.js (0 bytes): e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
- package.json (467 bytes): 4d6342705767832f299b9a59c28e4275bcf02db19472732f93f67d979441df8f

These identify inspected local files; they are not a claimed fresh registry integrity check.

### Recommended disposition

Keep the locked dependency and already-preserved framework notices. Do not fabricate a copyright owner/year, remove boundary checks, substitute an unreviewed package, or repeat the same source search indefinitely. Seek a maintainer's exact notice/source reference or a qualified assessment of the remaining attribution question. A maintainer response must be attributable and cover this release; a community answer or silence is insufficient to mark the evidence gap resolved.

No external message has been sent. Proposed question for a relevant official package/framework support channel:

> For client-only@0.0.1, the published package metadata declares MIT, but the installed package contains only package.json, index.js and error.js. The corresponding Next.js v15.5.28 vendored files also do not supply a package-specific copyright notice. Could you identify the applicable copyright and MIT permission notice, or the authoritative original source/release that supplies it? We want to preserve the correct notice without guessing the holder or year.

Confirm the appropriate maintainer/channel before sending. No private hosting, account, billing or medical data is needed.

## Launch-review disposition

| Workstream | Current decision | Next evidence/action |
|---|---|---|
| Notice preservation implementation | Implemented; local execution results recorded above | Preserve the tested notices and inclusion configuration. Do not call this exhaustive license clearance. |
| Remaining software attribution/obligations | Qualified; client-only question remains open; native-library obligations are not settled by a README table | Resolve the bounded source question and assess relevant obligations for the shipped artifact; avoid a blanket licence-free claim. |
| Existing general-guide/checklist scope | Prior owner-approved scope retained | Use existing publication review; no request to reapprove the same scope. |
| Code-specific pages | Held under the existing intended-use and billing-review gates | Obtain and record the evidence described in FIRST_CODE_RELEASE_ACTIONS_2026-11-08.md. This is separate from software attribution. |
| Final public release | Not executed or certified by this document | Present the exact candidate and remaining qualifications for the existing release-approval step, then perform controlled deployment and domain checks. |
| AdSense | No approval claimed | Consider application after a stable public release; technical tests are not an approval prediction. |

This update adds source findings and a decision record only. No new build or regression suite was run for the documentation change. The prior executed results retain their original scope and date.
