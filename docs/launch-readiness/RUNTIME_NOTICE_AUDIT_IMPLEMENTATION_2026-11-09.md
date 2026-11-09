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

