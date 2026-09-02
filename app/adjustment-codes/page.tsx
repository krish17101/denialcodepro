import { Wrench } from 'lucide-react';
import { CodeDirectory } from '../components/CodeDirectory';
import { codes } from '../lib/codes';

export const metadata = {
  title: 'Adjustment Codes Directory | DenialCode Pro',
  description:
    'Browse all medical billing adjustment codes with official problem descriptions and step-by-step solutions to resolve each adjustment.',
};

export default function AdjustmentCodesPage() {
  const count = codes.filter((c) => c.type === 'Adjustment Code').length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
            <Wrench className="h-3.5 w-3.5" />
            {count} Adjustment Codes
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy-800 sm:text-4xl">
            Adjustment Codes Directory
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Browse all claim adjustment codes with problem descriptions and
            actionable solutions.
          </p>
        </div>
        <CodeDirectory typeFilter="Adjustment Code" showFilterPills={false} />
      </main>
    </div>
  );
}
