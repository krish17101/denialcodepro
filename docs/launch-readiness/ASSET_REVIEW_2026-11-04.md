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
