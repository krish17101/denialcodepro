import { FileWarning } from 'lucide-react';
import { CodeDirectory } from '../components/CodeDirectory';
import { codes } from '../lib/codes';

export const metadata = {
  title: 'Denial Codes Directory | DenialCode Pro',
  description:
    'Browse all medical billing denial codes with official problem descriptions and step-by-step solutions to fix and appeal each claim.',
};

export default function DenialCodesPage() {
  const count = codes.filter((c) => c.type === 'Denial Code').length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 ring-1 ring-inset ring-rose-200">
            <FileWarning className="h-3.5 w-3.5" />
            {count} Denial Codes
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
            Denial Codes Directory
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse all claim denial codes with problem descriptions and
            actionable solutions.
          </p>
        </div>
        <CodeDirectory typeFilter="Denial Code" showFilterPills={false} />
      </main>
    </div>
  );
}
