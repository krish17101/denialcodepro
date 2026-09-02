import { ShieldPlus, Mail, Zap, Database, ShieldCheck } from 'lucide-react';
import { codes } from '../lib/codes';

export const metadata = {
  title: 'About | DenialCode Pro',
  description:
    'DenialCode Pro is a free reference directory for medical billing denial and adjustment codes, built to help billing teams resolve claims faster.',
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
              About DenialCode Pro
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Fast claim lookup & appeal solutions
            </p>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-slate-700">
          DenialCode Pro is a free programmatic reference directory for medical
          billing denial and adjustment codes. Our mission is to help medical
          billing professionals, coders, and revenue cycle teams quickly
          understand why a claim was denied or adjusted &mdash; and exactly
          what steps to take to fix or appeal it.
        </p>
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          Every code page includes the official problem description, a
          structured actionable solution, and related codes for easy
          navigation. We index {codes.length} codes and counting, with
          real-time search so you can find the answer you need in seconds.
        </p>
      </div>

      {/* Mission cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <MissionCard
          icon={<Zap className="h-5 w-5" />}
          title="Fast Lookup"
          text="Real-time search across every indexed code so you find answers instantly."
        />
        <MissionCard
          icon={<Database className="h-5 w-5" />}
          title="Comprehensive"
          text="Official problem descriptions and step-by-step solutions for each code."
        />
        <MissionCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Trustworthy"
          text="Reference information sourced from standard billing code sets, clearly disclaimed."
        />
      </div>

      {/* Contact */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-bold text-navy-800">Contact Us</h2>
        <p className="mt-3 text-base leading-relaxed text-slate-700">
          Have a question, correction, or code suggestion? We&apos;d love to
          hear from you.
        </p>
        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="mailto:contact@denialcodepro.com"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-800 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-900"
          >
            <Mail className="h-4 w-4" />
            denialcodepro@gmail.com
          </a>
          <span className="text-sm text-slate-400">
            Placeholder contact form &mdash; email link above for now.
          </span>
        </div>
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
