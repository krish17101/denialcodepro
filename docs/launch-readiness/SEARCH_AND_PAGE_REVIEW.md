# Search and page review — 28 October 2026

Scope: preview branch only. No merge to main, live-domain release, AdSense activation, research rewrite, or code-library restoration.

## Findings and fixes

- Home had no search control. Added a labeled search input, visible Search button on every screen size, suggested topics and inline links to relevant published guides.
- Search input did not retain the submitted query. It now initializes from the bounded URL query; the GET form also supports submission without client-side JavaScript.
- Former matching inspected only title/summary/first check. A shared search function now ranks published guide titles, topic keywords and body text, ignoring common filler words. It supplies no policy or code interpretation.
- Unmatched searches now explain the gap and show explicitly labeled starting points. Pure code searches (e.g. CO-29, CARC 16, N123) explicitly state that code lookup is unavailable; generic recommendations are not presented as code-specific matches.
- About/home wording was too abstract. Replaced internal terminology with a plain explanation of the purpose, current resources and limits. No founder name, credentials or independent review claim was invented.
- Added skip-to-content targets, visible keyboard focus, mobile-menu Escape handling and route-change closure, reduced-motion support, and print styles excluding navigation/footer/feedback.
- Terms and disclaimer metadata lacked canonical URLs and repeated the brand in titles. Corrected metadata without claiming a legal review.

## Page-by-page scope

| Page | Review / outcome |
| --- | --- |
| Home | Search, suggestions, clearer introduction and skip target added |
| Guides index | Source/readability, guide destinations and generated HTML checked |
| Three guide pages | Source structure and examples reviewed; shared skip target added; generated pages and links checked; original qualifications retained |
| Search | Ranking, query retention, empty/unmatched/code routes, escaping and rendered controls tested |
| Evidence checklist | Existing 18 input paths retested; explanation simplified and print shell corrected |
| About | Rewritten for natural wording, actual scope and contact; operator identity still requires owner decision |
| Editorial approach | Source and built output reviewed; AI assistance and review limits retained |
| Sources | Source and built links reviewed; external authorities not substantively revalidated in this UI task |
| Privacy | Source and built output reviewed; no new query analytics or patient-data entry added; query URL notice retained |
| Terms / disclaimer | Metadata and built output corrected/checked; legal completeness remains outside this test |
| Not found | Skip target and internal recovery links checked in generated output |
| Header / footer / feedback | Keyboard/navigation/print source review; no feedback message sent |
| Sitemap / robots | Source reviewed; only published routes listed; preview noindex retained |

## Actual verification

- `node scripts/test-public-search.js`: 21/21 passed. Covers ranking, code restrictions, whitespace/case, empty/unknown input, bounded query length, honest fallback labeling, escaping and server-rendered controls.
- `npm run test:launch`: 25/25 passed, including 18 existing checklist combinations.
- `npm run build`: passed, including 2 prebuild and 5 postbuild checks (the first 2 repeat; not 7 unique). Public imports still exclude held knowledge.
- `python scripts/audit-built-pages.py`: 13 generated HTML pages passed, including not-found; checked one main/H1, skip target, unique IDs, internal destinations and preview metadata. Dynamic search is covered separately by server-rendering tests.
- `npm run typecheck`: passed.

These are source, build and server-rendering checks. They do not establish responsive visual quality, screen-reader operation, browser keyboard behavior, feedback delivery, or live HTTP status handling.

## Browser blocker and release limits

The deployed preview was opened in the test browser and redirected to Vercel login. Deployment protection has not been disabled or bypassed. Full desktop/mobile interactive review remains BLOCKED pending authorized preview access. The managed local preview also has a previously observed Next/Vite launcher mismatch; application scripts were not changed to bypass it.

No claim is made that every legal/billing fact or external source was reverified. Contact ownership, privacy retention/processor details, licensing decisions for existing repository data, subject-matter review and AdSense readiness remain release questions. This update improves usability; it does not certify launch readiness.
