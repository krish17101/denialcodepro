import Link from 'next/link';
import type { Metadata } from 'next';
import { Search, ArrowRight, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { SearchBox } from './components/v3/SearchBox';

export const metadata: Metadata = {
  title: 'DenialCodePro — Understand the denial. Know what to do next.',
  description:
    'Search a denial code, remark code, denial combination, or describe the problem in plain English. Built for U.S. medical billers.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'DenialCodePro — Understand the denial. Know what to do next.',
    description:
      'Search a denial code, remark code, denial combination, or describe the problem in plain English.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DenialCodePro — Understand the denial. Know what to do next.',
    description:
      'Search a denial code, remark code, denial combination, or describe the problem in plain English.',
  },
};

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-navy-800">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(30,64,175,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 40%)',
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-700/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200 ring-1 ring-inset ring-sky-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              Medical Billing Denial Reference
            </span>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Understand the denial.{' '}
              <span className="text-emerald-400">Know what to do next.</span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Search a denial code, remark code, denial combination, or describe
              the problem in plain English.
            </p>

            {/* Search */}
            <div className="mx-auto mt-10 max-w-2xl">
              <SearchBox />
            </div>

            {/* Example searches */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-slate-400">Try:</span>
              {['CO-16', 'N382', 'CO-16 N382', 'units exceed maximum'].map(
                (example) => (
                  <ExampleChip key={example} query={example} />
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* What this tool helps you do */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold tracking-tight text-navy-800">
            Built for U.S. medical billers
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
            Each denial-resolution guide walks you through the diagnosis, the
            correction, the appeal path, and the fix to prevent it from
            recurring.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Search className="h-5 w-5" />}
              title="Why was it denied?"
              text="Understand what the denial code actually means and what triggered it."
            />
            <FeatureCard
              icon={<BookOpen className="h-5 w-5" />}
              title="What should I check?"
              text="Step-by-step diagnosis of the claim fields and documentation to review."
            />
            <FeatureCard
              icon={<ArrowRight className="h-5 w-5" />}
              title="What do I do next?"
              text="Correction, resubmission, reconsideration, or appeal — with the right evidence."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="How do I prevent it?"
              text="Upstream fixes to reduce the same denial from recurring across your claims."
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Content under construction notice */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-amber-900">
                Content is being built carefully.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-amber-800/80">
                DenialCodePro V3 is under active development. Denial-resolution
                guides will be published as each one is fully researched and
                verified against official CMS, X12, and MAC sources. We will not
                publish guidance we cannot verify.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Browse by type */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold tracking-tight text-navy-800">
            Browse by type
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <BrowseCard
              href="/denial-codes"
              title="Denial Codes"
              subtitle="CARC — Claim Adjustment Reason Codes"
              description="Codes that explain why a claim was adjusted or denied."
              color="rose"
            />
            <BrowseCard
              href="/remark-codes"
              title="Remark Codes"
              subtitle="RARC — Remittance Advice Remark Codes"
              description="Codes that provide additional explanation on the remittance."
              color="sky"
            />
            <BrowseCard
              href="/guides"
              title="Denial Guides"
              subtitle="Practical resolution workflows"
              description="Step-by-step guides for common denial combinations."
              color="emerald"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Trust & methodology */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg font-bold text-navy-800">
            How we source and verify content
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            Every guide on this site is built from official CMS publications,
            X12 code-set documentation, MAC provider manuals, and commercial
            payer policies. We document our sources on every page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
            >
              Our methodology
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/sources"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
            >
              Sources & references
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ExampleChip({ query }: { query: string }) {
  const encoded = encodeURIComponent(query);
  return (
    <Link
      href={`/search?q=${encoded}`}
      className="rounded-full bg-navy-700/40 px-3 py-1 text-xs font-medium text-sky-200 ring-1 ring-inset ring-sky-500/20 transition hover:bg-navy-700/60"
    >
      {query}
    </Link>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-bold text-navy-800">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}

function BrowseCard({
  href,
  title,
  subtitle,
  description,
  color,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  color: 'rose' | 'sky' | 'emerald';
}) {
  const badgeClass =
    color === 'rose'
      ? 'bg-rose-50 text-rose-600 ring-rose-200'
      : color === 'sky'
        ? 'bg-sky-50 text-sky-700 ring-sky-200'
        : 'bg-emerald-50 text-emerald-700 ring-emerald-200';

  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
    >
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${badgeClass}`}
      >
        {subtitle}
      </span>
      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-navy-800">{title}</h3>
        <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-navy-500" />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        {description}
      </p>
    </Link>
  );
}
