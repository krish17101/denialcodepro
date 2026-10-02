import type { Metadata } from 'next';
import { ShieldPlus, Mail, Search, BookOpen, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — DenialCodePro',
  description:
    'DenialCodePro helps U.S. medical billers understand why a claim was denied, what to check, what to do next, and how to prevent the denial from recurring.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-white">
            <ShieldPlus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-navy-800">
              About DenialCodePro
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Understand the denial. Know what to do next.
            </p>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-slate-700">
          DenialCodePro helps U.S. medical billers understand why a claim was
          denied, identify what to check, determine the appropriate next action,
          and understand how to prevent the denial from recurring.
        </p>
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          Every denial-resolution guide is researched from official CMS, X12,
          and Medicare Administrative Contractor (MAC) sources. We document our
          sources on every page and do not publish guidance we cannot verify.
        </p>
      </div>

      {/* What we help with */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <MissionCard
          icon={<Search className="h-5 w-5" />}
          title="Why was it denied?"
          text="Understand what the CARC and RARC codes on your remittance advice actually mean."
        />
        <MissionCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Verified guidance"
          text="Content sourced from CMS manuals, X12 code sets, and MAC publications — not invented."
        />
        <MissionCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Prevention first"
          text="Every guide includes upstream steps to reduce the same denial from happening again."
        />
      </div>

      {/* What we are building */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-navy-800">
          What we&apos;re building
        </h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          DenialCodePro V3 is under active development. We are systematically
          building researched denial-resolution guides prioritised by the most
          commonly occurring CARC/RARC combinations. Guides will be published as
          they are completed and verified.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
          >
            Read our methodology
          </Link>
          <Link
            href="/sources"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy-700 shadow-sm transition hover:bg-slate-50"
          >
            Browse sources
          </Link>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-navy-800">Contact</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          Have a question, correction, or suggestion? We&apos;d love to hear
          from you.
        </p>
        <a
          href="mailto:denialcodepro@gmail.com"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-900"
        >
          <Mail className="h-4 w-4" />
          denialcodepro@gmail.com
        </a>
      </div>
    </main>
  );
}

function MissionCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-bold text-navy-800">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  );
}
