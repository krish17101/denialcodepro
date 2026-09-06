import { LegalLayout } from '../components/LegalLayout';

export const metadata = {
  title: 'Privacy Policy | DenialCode Pro',
  description:
    'Privacy Policy for DenialCode Pro, including log files, cookies, Google AdSense, and the DoubleClick DART cookie disclosure.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <Section title="Overview">
        <p>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit DenialCode Pro.
        </p>
      </Section>

      <Section title="Log Files and Cookies">
        <p>
          Like many other Web sites, DenialCode Pro makes use of log files and
          cookies. The information inside the log files includes internet
          protocol (IP) addresses, browser type, Internet Service Provider
          (ISP), date/time stamp, referring/exit pages, and number of clicks
          to analyze trends and administer the site.
        </p>
      </Section>

      <Section title="Google AdSense and the DoubleClick DART Cookie">
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            Google, as a third-party vendor, uses cookies to serve ads on our
            site.
          </li>
          <li>
            Google&apos;s use of the DART cookie enables it to serve ads to our
            users based on their visit to our site and other sites on the
            Internet.
          </li>
          <li>
            Users may opt out of the use of the DART cookie by visiting the
            Google ad and content network privacy policy at the following URL:{' '}
            <span className="font-medium">
              http://www.google.com/privacy_ads.html
            </span>
          </li>
        </ul>
      </Section>

      <Section title="Third-Party Advertisers">
        <p>
          We use third-party advertising companies to serve ads when you visit
          our Website. These companies may use aggregated information (not
          including your name, address, email address, or telephone number)
          about your visits to this and other Web sites in order to provide
          advertisements about goods and services of interest to you.
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
