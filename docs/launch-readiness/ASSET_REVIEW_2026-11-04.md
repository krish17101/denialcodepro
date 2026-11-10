# Release wording and third-party notices — 4 November 2026

The candidate continues to offer three general guides and the evidence checklist. About and both search messages now describe that service without calling it a preview. Search still tells a visitor who enters a code that the suggestions do not interpret that code. Public access and indexing settings have not changed.

## What the release ships

Terms links to /third-party-notices.txt. The npm prebuild step creates this static UTF-8 file from the installed packages. It is fetched only when requested; it is not bundled into every guide. Generate it before serving the candidate. The historical code library and its evidence files are not inputs.

- Software and icons: preserve installed copyright and license text, including Lucide's combined ISC/Feather MIT notice. Include the available root notices of locked packages conservatively, including build tooling, plus LICENSE files in Next's compiled component directory. Identical notice bodies are printed once with the names to which they apply.
- Font: the layout uses Inter via next/font/google. Seven WOFF2 files were present in the inspected build. The complete font notice in notices/Inter-OFL.txt is byte-identical to the Google Fonts repository file ofl/inter/OFL.txt at blob 21f6aff961064c2e429f570995e446bcdd555422. Source: https://github.com/google/fonts/tree/main/ofl/inter (checked 4 November 2026).
- Native image runtime: both locally installed sharp-libvips variants supply a component/license table in README.md. Include these supplier notices even though they are not named LICENSE. A server file trace does not prove a native library is sent to browsers.
- Public directory at baseline: one Google site-verification HTML file. No stock photo collection or downloadable research PDFs were identified there.

## Inventory and limitations

ASSET_INVENTORY_2026-11-04.tsv was generated from package-lock.json, installed package metadata and bundled Next notice paths. Reproduce records with node scripts/collect-notices.cjs /tmp/dcp-inventory.json. This build had 569 locked dependency paths and 113 bundled-component records, 682 total. 654 were present locally. 295 distinct installed notice texts were collected in addition to Inter. For 100 installed records no matching root notice was collected. A license declaration, missing file, or entry in the lockfile does not establish redistribution permission, a violation, or actual shipment to visitors.

The local Next server file traces included two sharp-libvips packages plus @next/env and client-only among the original four root-notice gaps. The native suppliers' README tables are now included. Both marker/runtime packages declare MIT and the collection includes the Next and React license texts, but a separate file or an exact upstream attribution match for those two packages was not established in this review. At Netlify staging, compare the actual adapter/function payload with its upstream notices, including native image libraries, and resolve any missing attribution for what is actually distributed. Do not treat the package inventory as a legal opinion or clearance of every transitive dependency.

## Verification

Local production-mode Next build (preview indexing), 21 search tests, TypeScript check and 14-page static audit. Local HTTP checks covered Terms, About, CO-19 search and actual notice contents; the first localhost attempt and a cross-process retry had connection refusals. A 127.0.0.1 server and HTTP client in one process succeeded. No new billing claims, URLs retired on production, AdSense setup or Netlify action. This is a preview-branch change only.

## Native-library follow-up — 10 November 2026 (Asia/Calcutta)

Status: targeted source review and notice-assembly correction completed locally. Hosted delivery of this correction remains NOT_RUN. No legal certification, new hosting arrangement, licence purchase, or public release is implied.

### Evidence and distinctions

| Source actually inspected | Exact locator/version | Finding and limit |
|---|---|---|
| Installed native manifests and supplier tables | node_modules/@img/sharp-libvips-linux-x64 and sharp-libvips-linuxmusl-x64; package.json, README.md, versions.json | Both are 1.3.4, declaring LGPL-3.0-or-later; versions.json lists libvips 8.18.7 and component versions. Local observations, not a fresh tarball integrity check or proof of the exact production payload. |
| Supplier's release-tagged notices | https://github.com/lovell/sharp-libvips/blob/v1.3.4/THIRD-PARTY-NOTICES.md ; entire component table and following later-version statement; Git blob e6e343ff638ba6d444e1b5b2d66098bf0e9df098 | Multiple component licences, with specified LGPL components used under LGPLv3 through earlier licences' later-version clauses. A root repository licence alone is insufficient. |
| Supplier's packaging explanation | https://github.com/lovell/sharp-libvips/blob/v1.3.4/README.md ; Licences | Apache-2.0 applies to packaging scripts; binary contents have various licences. This does not make all binary contents Apache-2.0. |
| Maintainer explanation | https://github.com/lovell/sharp-libvips/issues/246 ; lovell, Owner, 22 August 2024 | Explains Sharp, shared libvips and its static dependencies as distinct layers. General architecture guidance; not a release-specific compliance approval. |
| License documents, FSF-authored text maintained by SPDX | https://github.com/spdx/license-list-data/blob/31846481de7ea17d92f2f46fad76abe58b2e9bb0/text/LGPL-3.0-or-later.txt ; LGPL sections 0, 3, 4, 5 and incorporated GPL sections 0, 2, 6 | LGPLv3 incorporates GPLv3 with additional permissions. Source blob 513d1c01fe5b5b9724e999d8eb041ff17d444eaa was retrieved and byte-matched locally. These are licence terms, not a determination that each distribution condition applies to this project. |

All sources above were inspected November 10, 2026 India time. The licence text is version 3 dated June 29, 2007, distinct from retrieval and package version dates. Direct GNU HTML and text URLs timed out; the SPDX-maintained text was used and its exact revision recorded. No paid licence requirement was established.

GPL section 0 distinguishes network interaction without a transferred copy from conveying. Section 2 separately addresses providing copies to another party to run them, with conditions. Section 6 addresses non-source conveyance; LGPL section 4 adds combined-work conditions, including copies of the licence documents and alternative relinking/shared-library mechanisms. Therefore a web visitor and a hosting provider must not automatically be treated as the same kind of recipient. Neither “server-side means no obligations” nor “LGPL means the website must be publicly open-sourced” is established by this review.

### Concrete correction and executed tests

The previous generated aggregate had supplier tables but no GNU LGPL or GPL licence-text headings. Added notices/LGPL-3.0-with-GPL-3.0.txt, preserving the complete inspected SPDX file byte-for-byte. The collector includes it when native packages are installed and rejects unreviewed native package versions instead of silently applying this package review to upgrades. The surrounding label limits the documents to the native dependencies; it does not relicense website articles.

Executed locally:
- node scripts/collect-notices.cjs — exit 0; 682 inventory records, 654 installed, 100 without root notice, 295 distinct collected texts (unchanged collector inventory counts; supplemental documents are additional).
- node scripts/test-supplemental-notices.cjs — exit 0; 7 checks passed: existing supplement, existing core notices, existing version rejection, complete native licence text, upstream blob equality, installed supplier tables, and native-version rejection before writing.
- Generated aggregate: 572579 bytes; SHA-256 d8e7c5ca5d5cdc750798af701c42a0d2d508c843c658986c9400bb44cac262b0. This identifies only the local generated file, not the previously hosted artifact.

The earlier three-check result is historical and is not added to these seven. No full application build, hosted bundle reinspection, browser/network audit or representative-user test ran for this correction.

### Bounded remaining questions

1. On the next staging build, verify that the new aggregate reaches both the public notice endpoint and the function ZIP through the existing inclusion rule. Compare with that build's generated bytes; dependency-platform differences can change the aggregate.
2. Determine the applicable hosting/conveyance path and any required component-specific notices, corresponding-source/relinking provisions, or other obligations for the actual shipped native components. No complete corresponding-source archive or written source offer has been prepared or certified here. Do not invent a source-availability promise in public terms.
3. Keep the exact client-only attribution question open. The public web retrieval of discussion #99484 in this step returned five older comments and omitted our previously browser-verified sixth comment; it is not reliable proof of current reply status. No new message was sent.
4. Code-content rights and actual billing-specialist review remain separate. This software-only change does not approve CARC 19 or the internal research library.

No dependency was removed or upgraded. No live setting, Analytics identifier, Google verification file, guide, research dossier or main branch changed.
