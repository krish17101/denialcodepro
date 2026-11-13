import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { brand, origin, pageSeo } from '../../lib/public/page-seo';
import { StructuredData } from '../components/StructuredData';
import { getPublicGuide, publicGuides } from '../../lib/public/guides';

// Keep the three released URLs as concrete routes on both hosting platforms.
function guide(slug: string) {
  const entry = getPublicGuide(slug);
  if (!entry) notFound();
  return entry;
}

export function guideMetadata(slug: string): Metadata {
  const g = guide(slug);
  return pageSeo('/guides/' + g.slug, g.title, g.summary, 'article');
}

export function GuideArticle({ slug }: { slug: string }) {
  const g = guide(slug);
  const url = origin + '/guides/' + g.slug;
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Investigation guides', path: '/guides' }, { name: g.title, path: '/guides/' + g.slug }];
  const publisher = { '@type': 'Organization', '@id': origin + '/#publisher', name: brand, url: origin + '/about' };
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Article', '@id': url + '#article', url, mainEntityOfPage: url, headline: g.title, description: g.summary,
      inLanguage: 'en-US', author: publisher, publisher, citation: g.sourceLinks.map(s => s.url) },
    { '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: origin + c.path })) }
  ] };
  const relatedGuides = publicGuides.filter(entry => entry.slug !== g.slug);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-4xl px-5 py-12">
      <StructuredData data={graph} />
      <nav aria-label="Breadcrumb"><ol className="flex flex-wrap gap-x-2 gap-y-1 text-sm text-slate-600">
        {crumbs.map((c, i) => <li key={c.path}>{i > 0 && <span aria-hidden="true" className="mr-2">/</span>}{i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link className="font-semibold text-navy-700 underline" href={c.path}>{c.name}</Link>}</li>)}
      </ol></nav>
      <h1 className="mt-5 text-3xl font-bold leading-tight text-navy-800 sm:text-4xl">{g.title}</h1>
      <p className="mt-4 text-lg text-slate-600">{g.summary}</p>
      <p className="mt-3 text-sm text-slate-500">By <Link href="/about" className="underline">DenialCodePro</Link> · <Link href="/methodology" className="underline">Editorial approach</Link> · Workflow updated {g.updatedOn ?? '27 October 2026'} · Fictional examples</p>

      <section id="first-check" tabIndex={-1} className="scroll-mt-24 mt-7 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-bold text-emerald-900">What to check first</h2>
        <p className="mt-2 text-emerald-900">{g.firstCheck}</p>
        <p className="mt-4 text-sm text-emerald-900">{g.scopeNote ?? 'This guide recommends investigation steps. It does not establish a payer requirement, deadline, appeal right, or permission to bill a patient.'}</p>
      </section>

      <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-navy-700">
        <a href="#next-steps" className="inline-flex min-h-11 items-center underline">Choose your next step</a>
        <a href="#detailed-checks" className="inline-flex min-h-11 items-center underline">Detailed checks</a>
        {g.recordFields?.length ? <a href="#deadline-record" className="inline-flex min-h-11 items-center underline">Deadline record</a> : null}
        <a href="#examples" className="inline-flex min-h-11 items-center underline">Examples</a>
        <a href="#sources" className="inline-flex min-h-11 items-center underline">Sources and limits</a>
      </nav>

      <section id="next-steps" tabIndex={-1} className="scroll-mt-24 mt-7">
        <h2 className="text-2xl font-bold text-navy-800">Match the finding to a next step</h2>
        <p className="mt-3 text-slate-600">Choose the statement that matches your records to jump to its checks and next action. If the facts are unclear, use the uncertain or conflicting-information route below.</p>
        <nav aria-label="Find your situation" className="mt-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
          <ul className="divide-y divide-slate-100">
            {g.branches.map((b, index) => (
              <li key={b.finding}>
                <a href={`#finding-${index + 1}`} className="flex min-h-11 items-start gap-3 rounded-lg px-3 py-3 font-semibold text-navy-700 underline decoration-slate-300 underline-offset-4 hover:bg-slate-50">
                  <span aria-hidden="true" className="shrink-0 text-slate-500">{index + 1}.</span>
                  <span>{b.finding}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-5 space-y-4">
          {g.branches.map((b, index) => (
            <article id={`finding-${index + 1}`} tabIndex={-1} key={b.finding} className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-navy-800">If: {b.finding}</h3>
              <p className="mt-3 text-slate-700"><strong>Then:</strong> {b.action}</p>
              <p className="mt-3 text-sm text-slate-600"><strong>Keep:</strong> {b.keep}</p>
              <a href="#next-steps" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-navy-700 underline">Choose a different finding</a>
            </article>
          ))}
        </div>
      </section>

      <nav id="detailed-checks" tabIndex={-1} aria-label="Detailed checks" className="scroll-mt-24 mt-9 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold text-navy-800">Go to a detailed check</h2>
        <ul className="mt-3 space-y-1">
          {g.sections.map((s, index) => (
            <li key={s.title}><a href={`#check-${index + 1}`} className="inline-flex min-h-11 items-center py-2 font-semibold text-navy-700 underline">{s.title}</a></li>
          ))}
        </ul>
      </nav>
      {g.sections.map((s, index) => (
        <section id={`check-${index + 1}`} tabIndex={-1} className="scroll-mt-24 mt-9" key={s.title}>
          <h2 className="text-2xl font-bold text-navy-800">{s.title}</h2>
          {s.paragraphs.map(p => <p className="mt-4 leading-relaxed text-slate-700" key={p}>{p}</p>)}
          {s.sourceUrls?.map(url => <p className="mt-3 text-sm" key={url}><a href={url} className="font-semibold text-navy-700 underline">Source: {g.sourceLinks.find(ref => ref.url === url)?.title}</a></p>)}
        </section>
      ))}

      {g.recordFields?.length ? (
        <section id="deadline-record" tabIndex={-1} className="scroll-mt-24 mt-9">
          <h2 className="text-2xl font-bold text-navy-800">Build your deadline record</h2>
          <p className="mt-3 text-slate-600">Use these checks in your approved work system. This page does not collect case information or calculate a deadline.</p>
          <dl className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {g.recordFields.map(row => <div key={row.field} className="grid gap-2 p-5 sm:grid-cols-[12rem_1fr]"><dt className="font-semibold text-navy-800">{row.field}</dt><dd className="leading-relaxed text-slate-700">{row.check}</dd></div>)}
          </dl>
        </section>
      ) : null}

      <section id="examples" tabIndex={-1} className="scroll-mt-24 mt-9">
        <h2 className="text-2xl font-bold text-navy-800">Work through an example</h2>
        {g.examples.map(e => <article className="mt-5 rounded-xl border border-slate-200 bg-white p-6" key={e.title}><h3 className="font-bold text-navy-800">{e.title}</h3><p className="mt-3 text-slate-700"><strong>Facts:</strong> {e.facts}</p><p className="mt-3 text-slate-700"><strong>Reasoning:</strong> {e.reasoning}</p><p className="mt-3 text-slate-700"><strong>Conditional action:</strong> {e.action}</p></article>)}
      </section>

      <section id="sources" tabIndex={-1} className="scroll-mt-24 mt-9 border-t border-slate-200 pt-7">
        <h2 className="text-xl font-bold text-navy-800">Official references and limitations</h2>
        <p className="mt-3 text-sm text-slate-600">The linked references help locate applicable authority; they do not prescribe every editorial step above. Source pages checked {g.sourcesCheckedOn ?? '27 October 2026'}. Confirm the controlling requirement for the actual claim.</p>
        <ul className="mt-4 space-y-4">{g.sourceLinks.map(s => <li key={s.url}><a href={s.url} className="font-semibold text-navy-700 underline">{s.title}</a><p className="mt-1 text-sm text-slate-600">{s.scope}</p></li>)}</ul>
        <Link href="/tools/evidence-checklist" className="mt-7 inline-block rounded-lg bg-navy-800 px-5 py-3 font-semibold text-white">Build your evidence checklist</Link>
      </section>

      <nav aria-label="Related investigation guides" className="mt-10 border-t border-slate-200 pt-7">
        <h2 className="text-xl font-bold text-navy-800">Continue with a related guide</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {relatedGuides.map(entry => (
            <Link key={entry.slug} href={`/guides/${entry.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-emerald-600">
              <span className="font-semibold text-navy-700 underline">{entry.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-slate-600">{entry.summary}</span>
            </Link>
          ))}
        </div>
      </nav>
    </main>
  );
}
