import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Report an unclear explanation, suggest a correction, or ask about DenialCodePro website privacy.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-3xl space-y-8 px-5 py-12">
      <div>
        <h1 className="text-3xl font-bold text-navy-800">Contact DenialCodePro</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-700">Found a confusing step or something that needs correcting? Tell us which page you were reading and what needs attention.</p>
        <a href="mailto:denialcodepro@gmail.com" className="mt-5 inline-block break-all font-semibold text-navy-700 underline">denialcodepro@gmail.com</a>
      </div>
      <section aria-labelledby="contact-privacy" className="rounded-xl border border-amber-200 bg-amber-50 p-5">
        <h2 id="contact-privacy" className="text-xl font-bold text-navy-800">Keep patient information out of your message</h2>
        <p className="mt-3 leading-relaxed text-slate-700">This address is for website feedback. Do not send patient names, dates of birth, member or claim numbers, medical records, or screenshots of claims and remittances. Describe the website issue in general terms.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-navy-800">For a correction or unclear explanation</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-700">
          <li>Include the page address and the heading or sentence you mean.</li>
          <li>Explain what seems incorrect, incomplete, or difficult to follow.</li>
          <li>If available, link to a public official source and identify the relevant section, date, and payer or program.</li>
        </ul>
        <p className="mt-3 leading-relaxed text-slate-700">You do not need to share a real claim to report a problem with a guide.</p>
      </section>
      <section>
        <h2 className="text-xl font-bold text-navy-800">For questions about a claim</h2>
        <p className="mt-3 leading-relaxed text-slate-700">DenialCodePro provides educational guides, not individual claim handling. Contact the responsible payer or your billing supervisor through an approved channel for case-specific questions. Sending website feedback does not submit a claim, correction, appeal, or deadline-extension request.</p>
        <Link href="/guides" className="mt-3 inline-block font-semibold text-navy-700 underline">Browse the investigation guides</Link>
      </section>
      <section>
        <h2 className="text-xl font-bold text-navy-800">For website privacy questions</h2>
        <p className="mt-3 leading-relaxed text-slate-700">Use the same email address for questions about information you sent to this website. Include only what is needed to explain your request.</p>
        <Link href="/privacy-policy" className="mt-3 inline-block font-semibold text-navy-700 underline">Read the privacy policy</Link>
      </section>
    </main>
  );
}
