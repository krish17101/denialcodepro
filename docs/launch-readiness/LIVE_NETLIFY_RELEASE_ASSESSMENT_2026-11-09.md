# Live Netlify release assessment — 9 November 2026

Status: read-only configuration review completed. Production release NOT approved or executed.

## Confirmed account observations

Inspected the signed-in Netlify project `denialcode` after secure sign-in was restored. No authentication values were read or recorded.

| Area | Direct observation | Consequence |
|---|---|---|
| Repository | Developer settings → Repository → Current repository: **Not linked** | A push to the preview GitHub branch is not a configured Git release path for this live project. |
| Publishing | Deploys: **Auto publishing is on. Deploys are published automatically.** The available control is “Lock to stop auto publishing.” | Do not describe the live project as publishing-paused. No lock was applied. |
| Published artifact | Deploy `6ab54557861ed20008af15f4`, September 24, main@`96db67c38ae9226f1cc9e64c6565c6640783505b`, “Create googlec966e072ab59a2e7.html” | Record this as the current rollback candidate, not a tested rollback. |
| Deployment provenance | Deploys overview says “Last deployed from Netlify Drop”; the published artifact detail says deployed by GitHub with Next.js | Preserve both observations. “Not linked” establishes current configuration, not how the historical artifact was built. Do not infer a manual upload history from the overview label alone. |
| Domain | `denialcodepro.com` is primary; `www.denialcodepro.com` is labelled as redirecting automatically to primary; both use Netlify DNS | Keep the existing project/domain binding. This is a settings observation, not a new HTTP redirect test. |
| HTTPS | Dashboard says HTTPS enabled, Let's Encrypt, covering apex and wildcard; auto-renews before January 20, 2027 | No certificate or DNS change required by this observation. This is not an independent TLS audit. |

Read-only pages:
- https://app.netlify.com/projects/denialcode/configuration/developer-settings
- https://app.netlify.com/projects/denialcode/deploys
- https://app.netlify.com/projects/denialcode/deploys/6ab54557861ed20008af15f4
- https://app.netlify.com/projects/denialcode/domain-management

The deployed file browser lists the Google verification file. The artifact summary reports a Next.js runtime, one function, two redirect rules and one header rule. Their full contents were not inspected in this session. The Options menu offers “Download deployed files”; no download or rollback was executed. A static download must not be assumed to be a complete runtime backup.

Historical skipped builds mention exceeded credits. Those historical messages do not establish the current account balance or available build allowance.

## Candidate configuration inspected

Fetched these actual files from `krish17101/denialcodepro`, branch `codex/original-content-preview`:
- `netlify.toml`: build command `npm run build`, publish `.next`, plugin `@netlify/plugin-nextjs`.
- `lib/public/analytics-environment.ts`: Analytics enabled only in the intended Netlify production environment, with preview/mixed-host exclusions.
- `lib/public/indexing.ts`: indexing requires explicit approval plus unambiguous production signals.
- `docs/launch-readiness/NETLIFY_AUTHENTICATED_REVIEW_2026-11-08.md`: retains the 17 executed hosted-preview task checks and their limitations.

Also inspected local `next.config.js`, the prior preparation/release records and the Google verification file. Found Analytics stream `G-QL011FYKSR` in `public/site-measurement.html`. No Analytics or verification file was changed. Google Analytics receipt and Search Console account verification were not re-tested.

## Proposed release method — not executed

Prefer a controlled Git-backed release on the existing live project, preserving its domain. This is a proposal requiring the owner's approval before the live configuration is changed.

1. Resolve candidate content/rights approval and explicitly approve the legacy-URL disposition. The three-guide candidate replaces the older lookup experience; it is not equivalent full code coverage. Keep CARC 19 held under the separate first-code release gates.
2. Select an exact reviewed commit. Confirm the hosted preview's source commit and check current build allowance before initiating another build.
3. With approval, lock the currently published deploy before linking the live project to Git or triggering a build. Confirm the lock in the UI. Locking publication does not stop builds.
4. Connect the correct repository and select the agreed release branch/commit path. Inspect build settings, Node version, adapter, environment scopes and redirect/header configuration. Do not point the live project at a moving branch without an agreed release process.
5. Preserve Analytics and Search Console assets. Set the indexing approval flag only for the approved production build context; leave previews non-indexable. Build a fresh production-context candidate while publication remains locked, then inspect the unpublished artifact and logs. Do not promote a previously compiled preview assuming its build-time settings will change.
6. Verify guide/search/checklist behavior, real 404 responses, canonical URLs, robots headers/meta, sitemap, and required verification assets on the exact candidate. Check production measurement through the approved live validation flow after publication.
7. Obtain final approval for the exact artifact and then explicitly publish it. Recheck the actual domain immediately. Keep automatic publication controlled until the release is accepted.

Do not drag the raw Next.js source or a bare `.next` folder into Drop as a substitute for the tested framework build.

## Rollback plan and limitations

Recorded rollback candidate: `6ab54557861ed20008af15f4`. Before release, confirm it remains available and that its files and runtime are suitable for restoration. Netlify's “Manage deploys” documentation, sections **Rollbacks**, **Locked deploys** and **Automatic deploy deletion**, directly inspected November 9, 2026, describes republishing an available successful deploy and warns that later automatic production deployments can replace it. It also describes retention exclusions; do not assume indefinite availability after replacement.

Authority: https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/

If an approved release causes a material regression, keep publication controlled and republish the recorded prior artifact if available, then verify the domain. Artifact rollback is not proof that separately changed environment, DNS or other settings were restored. No rollback was attempted today, and no “Publish deploy” control was tested on an older successful artifact.

## Validation and preservation scope

- Completed read-only inspection of repository/publishing settings, current artifact, and domain/HTTPS configuration.
- Read four remote repository files; inspected local supporting configuration.
- No automated build, unit suite, HTTP audit, medical-source review or usability suite rerun today. Earlier results remain dated and separate.
- No deployment, Git linkage, DNS, environment, publication lock, production branch, application source, research dossier or measurement setting changed.
- This update adds only this review document on the preview branch. No new whole-tree checksum verification is claimed.

## Remaining decisions

The live “paused Git deployment” assumption is now resolved: the repository is unlinked and auto publishing is on. Exact release commit, current environment/build allowance, approved legacy-route handling and content release decisions remain outstanding. First-code rights and independent billing-specialist review remain open under `FIRST_CODE_RELEASE_ACTIONS_2026-11-08.md`; they are not resolved by hosting tests.

Next milestone: approve the release scope and exact candidate, then perform the controlled live-project setup above. AdSense application follows a stable public release; no approval, ranking or licence-free certification is made.
