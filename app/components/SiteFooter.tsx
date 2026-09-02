import Link from 'next/link';
import { ShieldPlus, Mail } from 'lucide-react';

const footerLinks = [
  {
    title: 'Directory',
    links: [
      { href: '/', label: 'All Codes' },
      { href: '/denial-codes', label: 'Denial Codes' },
      { href: '/adjustment-codes', label: 'Adjustment Codes' },
    ],
  },
  {
    title: 'Company',
    links: [{ href: '/about', label: 'About Us' }],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Medical Disclaimer' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-white">
                <ShieldPlus className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-navy-800">
                DenialCode<span className="text-emerald-600">Pro</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              The fast reference directory for medical billing denial and
              adjustment codes.
            </p>
            <a
              href="mailto:contact@denialcodepro.com"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-900"
            >
              <Mail className="h-4 w-4" />
              contact@denialcodepro.com
            </a>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-navy-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} DenialCode Pro. Reference
            information only &mdash; not legal, medical, or financial billing
            advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
