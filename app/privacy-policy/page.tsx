import { LegalLayout } from '../components/LegalLayout';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How DenialCodePro handles website feedback, search URLs, and technical information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <Section title="Website information and patient privacy">
        <p>DenialCodePro provides medical-billing educational information. Do not submit patient names, member or claim numbers, medical records, or other sensitive information through search or feedback.</p>
      </Section>
      <Section title="Search and technical records">
        <p>Search terms appear in the search page URL. They can therefore appear in browser history and technical request logs. Use code identifiers or general topics, not patient information.</p>
        <p>Website delivery involves technical request information, such as an IP address and requested URL. The hosting provider processes requests to serve and protect the site. Contact us with questions about the processing of your information.</p>
      </Section>
      <Section title="Feedback and email">
        <p>Where the feedback form is enabled, your name, email address, and message are sent through Web3Forms so we can receive and respond to website feedback. If you email us directly, your email provider and ours process that correspondence.</p>
        <p>Send only the information needed to describe a website problem. To ask about or request deletion of a message you sent, contact <a href="mailto:denialcodepro@gmail.com" className="underline">denialcodepro@gmail.com</a>. Do not send patient documents to establish your request.</p>
      </Section>
      <Section title="Analytics and advertising">
        <p>This release does not load Google Analytics or Google AdSense through the application. If advertising or analytics is enabled later, this notice and the applicable consent controls must be updated before those services are activated.</p>
      </Section>
      <Section title="Evidence checklist">
        <p>The evidence checklist uses categorical selections in the current page. Its application code does not save those selections to browser storage or submit them to a server. This does not eliminate the technical requests needed to load the website.</p>
      </Section>
      <Section title="External sources and questions">
        <p>Links to sources take you to websites with their own privacy practices. For questions about this website or your feedback, email <a href="mailto:denialcodepro@gmail.com" className="underline">denialcodepro@gmail.com</a>.</p>
      </Section>
    </LegalLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-navy-800">{title}</h2><div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div></section>;
}
