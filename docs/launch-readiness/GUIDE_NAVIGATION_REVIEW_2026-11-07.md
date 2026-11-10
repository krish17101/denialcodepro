# Guide navigation review — 7 November 2026

## Result

Navigation improvement completed on `codex/original-content-preview` at application commit `c04f05c6cb1ddd8d0ed3f10f3d8477f5b62c492c`. Base: `4fe67f1fc508ce353af7e66df2d4fce8ce991ce7`.

The application change is confined to `app/guides/GuideArticle.tsx`:

- First check and scope warning precede the navigation.
- Each of the three guides has direct links to its five findings and a return-to-choices link.
- Detailed sections have links and focusable fragment targets.
- Two related-guide cards connect the existing guides.
- All guidance, sources, limitations, source-review dates and examples remain in the existing content file. No claim is hidden behind a disclosure, paywall or extra page.
- Existing fragment targets remain; new fragment IDs are positional and must be reviewed if section/finding order changes in future.

No code-reference page was published. The CARC 19 draft and its rights/specialist-review gates remain open. This work does not finish the seven-day launch plan or establish a publishable code-page count.

## Checks actually executed

Commands from the `analytics_candidate` checkout:

| Command | Result | Scope |
|---|---|---|
| `npm run build` | Passed | Next production build, TypeScript check and pre/post publication-boundary checks. |
| `npm run test:launch` | 25 passed, 0 failed | Existing checklist and launch regressions. |
| `node scripts/test-analytics.cjs` | 18 passed, 0 failed | Existing analytics privacy and environment tests. |
| `python3 scripts/audit-built-pages.py` | 14 generated pages passed, plus robots/sitemap checks | Headings, IDs, internal links, canonical metadata and preview noindex. |

A one-time Python HTMLParser check additionally inspected the three built guide documents. Each had five finding targets, every finding/detail target had a matching shortcut, IDs were unique and each guide linked to the other two. Detailed-target counts: response guide 5, correction/review guide 6, deadline guide 5. This is structural inspection, not behavioral or factual certification.

Five SHA-256 before/after comparisons confirmed unchanged files: `lib/public/guides.ts`, `app/components/Analytics.tsx`, `lib/public/analytics-environment.ts`, `public/site-measurement.html`, `public/googlec966e072ab59a2e7.html`. The content file also matched the inspected remote Git blob `f92cfe9ad7fb7ab5b2cadf05acbc1fe614f8db13`.

The initial build invocation had a log-directory/work-directory error and did not run the build. The corrected invocation above completed successfully. No tests were weakened.

## Hosted checks

GitHub status for the application commit returned success for Vercel and `netlify/denialcodepro-guide-staging/deploy-preview`. Netlify's success target was `https://deploy-preview-1--denialcodepro-guide-staging.netlify.app`. This confirms its reported deployment status, not a browser test of that URL.

Browser checks used the existing Vercel branch preview:
`https://denialcodepro-git-codex-original-co-ad86bd-krish17101s-projects.vercel.app/`

Nine task checks completed:

1. Correction guide finding 2: pointer activation updated fragment and focus to `finding-2`; after scrolling settled, its top was 96px below the viewport top, clear of the header.
2. Return link: keyboard Enter moved to `next-steps`.
3. Detailed check 3: confirmed href `#check-3`; keyboard and isolated pointer activation reached that section.
4. Related-guide card opened the deadline guide.
5. Conflicting deadline shortcut reached `finding-3` with focus on that target.
6. Deadline-record shortcut reached `deadline-record` with its explanatory text.
7. Related-guide card opened the response guide.
8. Unknown/conflicting-response shortcut reached `finding-1` with focus on that target.
9. Sources shortcut reached `sources` and retained the references and scope text.

One rapid pointer action immediately after an animated anchor return initially reached detailed check 2 instead of the intended check 3. The intended link's href was correct; keyboard activation and an isolated pointer retest reached check 3. The initial mismatch is retained here rather than counted as a clean first-run pass. No source change was made on the basis of that transient result.

Desktop screenshot inspection confirmed readable action cards and clearance below the fixed header. This is not a full accessibility audit or representative medical-biller study. Mobile rendering of this new navigation was **not tested**; earlier mobile results do not cover it.

## Environment limitations

Managed local browser preview could not start: its launcher appended `--host 127.0.0.1 --port 4173 --strictPort` to Next.js, which rejected `--host`. `sites-preview status` confirmed stopped. Working application settings were not modified to accommodate the launcher. Production build checks remained usable.

The Netlify staging root redirected this browser to team protection and required an invited account. No authentication or protection settings were changed. Hosted interaction checks were performed on Vercel instead; Netlify browser verification remains outstanding.

## Preservation and publication boundary

The application commit changes only the shared guide component. This report is a separate documentation checkpoint. No production deployment, main merge, custom-domain change, AdSense setup, research dossier rewrite or production content conversion was performed. Analytics and the Search Console verification asset were preserved. Their presence does not establish current Google account ownership or receipt of analytics events.

No authoritative medical-billing sources were refreshed in this UI-only step. Existing source-review dates were deliberately retained. Source correctness, intended-use rights and independent review must not be inferred from these checks.

## Next work

Complete mobile and Netlify browser checks when the relevant preview access is available. Resolve the CARC 19 intended-use and billing-specialist review gates before adding code-specific content to the website. Continue other launch checks without treating this guide-only preview as completion of the agreed code-search product. Obtain specific owner approval before any live release.
