# Release review — 3 November 2026

Status: preview candidate; production release NOT approved or executed.

## Owner decisions
- Routine feedback emails: delete within 90 days after conversation resolution; correction notes may remain without sender personal details. Owner-approved operational policy, not a legal retention requirement.
- Only owner accesses mailbox. Delivery user-confirmed after messages found in Spam; Inbox placement not independently tested.
- Mobile testing reported passed by owner. Device/browser/case evidence not supplied; no agent mobile test claim.
- Netlify serves the domain and is paused, per owner. Leave paused until release steps are finished. Vercel preview does not prove Netlify runtime behavior.

## Implementing retention
The notice is a commitment the owner must carry out; editing it does not automate Gmail. Track when routine feedback conversations are resolved and review them sufficiently often to meet the 90-day limit. Preserve useful correction information without names, email addresses or identifying message details. Do not retain the original message merely as a correction note. Do not send patient records. No mailbox configuration, deletion or scheduled automation was performed. Provider-side retention is not established by this policy.

## Candidate scope
Three original investigation guides, evidence checklist, guide search, and trust/contact pages. This is not a released searchable CARC library; searches such as CO-19 cannot yet yield a full code dossier. Research remains internal. No ad activation, licenses accepted or code-list redistribution approval.

## Remaining release gates
1. Prepare Netlify-aware indexing and tests: current lib/public/indexing.ts recognizes only Vercel. Netlify documents NETLIFY=true and CONTEXT deployment values in Build environment variables, Read-only variables / Build metadata (accessed 3 November 2026): https://docs.netlify.com/build/configure-builds/environment-variables/ . Keep all previews noindex and indexing approval explicit. Actual hosted settings remain uninspected.
2. Change Netlify build command from npx next build to npm run build so package pre/post build boundary checks execute; test before deployment. No change made yet, per deferred hosting phase.
3. Verify Netlify runtime, environment scopes, redirects/headers, optional form and injected integrations on a non-production build before resuming live updates. Check real domain metadata after final release.
4. Approve legacy URL disposition: 318 baseline paths in LEGACY_ROUTE_DISPOSITION_2026-10-31.csv; proposed 404 for old code/directory pages with no equivalent guide. This removes old code lookup, not an equivalent replacement. Do not redirect every code to a generic guide. Earlier local HTTP tests do not establish Netlify behavior or current Google index coverage.
5. Finish source-rights and content release review; no blanket license-free or legal-compliance certification. Independent billing expert review has not occurred. AdSense review is later and remains Google's decision.
6. Approve exact production commit and release/rollback process only after these gates. Keep production paused meanwhile.

## Validation for this update
See RETENTION_QA_2026-11-03.md and accompanying build/audit logs. Earlier test totals are not counted as current results. Netlify account, DNS, domain routing, production environment and main branch were not changed.
