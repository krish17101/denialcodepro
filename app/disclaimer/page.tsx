import { AlertTriangle } from 'lucide-react';
import { LegalLayout } from '../components/LegalLayout';

export const metadata = {
  title: 'Billing Disclaimer',
  alternates: { canonical: '/disclaimer' },
  description:
    'Medical billing disclaimer for DenialCode Pro. This website provides educational information only and does not constitute official legal, medical, or financial billing advice.',
};

export default function DisclaimerPage() {
  return (
    <LegalLayout title="Disclaimer">
      {/* Highlighted disclaimer banner */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-base font-semibold leading-relaxed text-amber-900">
          The information provided on DenialCode Pro (the &quot;Website&quot;)
          is for general informational and educational purposes only. It is not
          intended to be a substitute for professional medical billing, coding,
          legal, or financial advice.
        </p>
      </div>

      <Section title="Accuracy & Reliability">
        <p>
          Applicable billing rules can change. Confirm the current authority and scope before relying on a rule for a real claim. DenialCode Pro makes no representations or warranties of
          any kind, express or implied, about the completeness, accuracy,
          reliability, or suitability of the information contained on the
          Website. Any reliance you place on such information is strictly at
          your own risk.
        </p>
      </Section>

      <Section title="Always Verify with Official Sources">
        <p>
          Always verify coding and billing guidelines directly with the
          specific insurance payer, Medicare Administrative Contractor (MAC),
          or the official X12/CMS publications before submitting or appealing a
          medical claim.
        </p>
      </Section>
    </LegalLayout>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-navy-800">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">
        {children}
      </div>
    </div>
  );
}
