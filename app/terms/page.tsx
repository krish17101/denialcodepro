import { LegalLayout } from '../components/LegalLayout';

export const metadata = {
  title: 'Terms of Service | DenialCode Pro',
  description:
    'Terms of Service for using DenialCode Pro, an educational website with original claim-investigation guides.',
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <Section title="Acceptance of Terms">
        <p>
          By accessing and using DenialCode Pro, you accept and agree to be
          bound by the terms and provision of this agreement.
        </p>
      </Section>

      <Section title="Use of the Site">
        <p>
          The educational material provided on this website is for personal and internal
          business use to assist with medical revenue cycle management (RCM)
          troubleshooting. You agree not to use the Website for any unlawful
          purpose or in any way that could damage, disable, overburden, or
          impair the site.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          The original content, features, and functionality of the Website
          are owned by DenialCode Pro. Third-party materials and linked resources remain subject to their owners’ rights. Links do not grant permission to reproduce those materials.
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
