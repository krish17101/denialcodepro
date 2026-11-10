# Original-content preview draft

Prepared 27 October 2026. This is a draft for review, not authorization to merge or deploy the live site.

## Scope

Three original, plain-English guides and a categorical evidence-checklist tool replace the public code-directory experience in this candidate. Search covers these three guides only. Recommendations are distinguished from payer requirements; examples are fictional. No code-specific deadline, guaranteed outcome, or expert credential has been invented. AI assistance is disclosed in the editorial methodology.

The existing code and payer route entry points are removed from this candidate. Their original files and all research remain preserved locally and/or in existing Git history. No archived route copies, research dossiers, historical QA reports, or hardcoded service keys are added by this commit. This does not remove material already in the public repository or its history, and does not establish licensing clearance for that existing material.

Next.js is updated to 15.5.28, React to 18.3.1, and PostCSS to 8.5.32 with a nested dependency override. Unused Zod and the old SWC-WASM dependency are removed. The dependency audit on 27 October reported zero known vulnerabilities; that is not a security guarantee.

## Configuration

No analytics or advertising scripts load through the application. Preview metadata is noindex; it must be intentionally changed when a release is approved. Noindex is not privacy or access control.

The feedback form is enabled only when NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is configured; otherwise a website-feedback email link is displayed. This variable is client-visible. Do not put a private credential in it. Delivery and ownership of the email address must be confirmed by the operator before launch. No feedback was submitted during testing.

## Validation

- `npm run build`: production compilation, type checking, route generation, and publication-boundary checks.
- `npm run typecheck`: TypeScript validation.
- `npm run test:launch`: 25 checks covering 18 checklist input combinations and seven regression checks.
- `node scripts/check-publication-boundary.js --built`: five checks covering allowed routes, reachable modules, built routes, sample held text, and generated guide pages. Prebuild runs two of these same checks; do not sum repeated checks as unique tests.
- `npm run validate:knowledge`: existing 27 fixtures and five retained structured guides. Passing does not certify factual correctness or rights.

The local preservation option `--preservation` uses a local-only manifest and archive. It is not required by CI and is intentionally not part of this public commit. The locally retained 144 research files, including 71 dossiers, were compared with their baseline and remained unchanged. Sixteen archived files were hash-checked.

Browser/mobile QA remains blocked in the managed environment: its preview launcher supplies unsupported Vite flags to Next dev. A production build does not establish browser usability. Test desktop/mobile layout, keyboard behavior, search, checklist reset/print, removed-route 404s and contact delivery in the hosting preview before release.

## Release gates

Review the narrowed content scope; verify the operator/contact information and privacy practices; conduct billing/editorial review; resolve rights for any restored data and existing public distribution; complete browser QA. Only then consider publishing and enabling indexing. AdSense eligibility and approval remain separate decisions; neither approval nor revenue is promised.
