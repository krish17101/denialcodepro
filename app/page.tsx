import { Zap, Database, ShieldCheck, Clock } from 'lucide-react';
import { CodeDirectory } from './components/CodeDirectory';
import { codes } from './lib/codes';

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-800">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(30,64,175,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.15) 0%, transparent 40%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-700/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-200 ring-1 ring-inset ring-sky-500/30">
              <Zap className="h-3.5 w-3.5" /> Fast Claim Lookup & Appeal
              Solutions
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The Medical Billing Denial Code Directory
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-300">
              Search official denial and adjustment codes. Get the problem
              description and step-by-step solution to fix and appeal every
              claim &mdash; instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-slate-200 sm:grid-cols-4 sm:divide-x">
          <Stat
            icon={<Database className="h-5 w-5" />}
            value={`${codes.length}`}
            label="Codes Indexed"
          />
          <Stat
            icon={<ShieldCheck className="h-5 w-5" />}
            value="100%"
            label="Official Descriptions"
          />
          <Stat
            icon={<Zap className="h-5 w-5" />}
            value="Real-time"
            label="Instant Search"
          />
          <Stat
            icon={<Clock className="h-5 w-5" />}
            value="24/7"
            label="Always Available"
          />
        </div>
      </section>

      {/* Search hub + directory */}
      <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy-800">
            Search the Code Directory
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Filter by category or type to find the exact code you need.
          </p>
        </div>
        <CodeDirectory autoFocus initialCategory="All" />
      </main>
    </>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 px-4 py-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-700">
        {icon}
      </div>
      <div className="text-left">
        <div className="text-xl font-bold text-navy-800">{value}</div>
        <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </div>
      </div>
    </div>
  );
}
