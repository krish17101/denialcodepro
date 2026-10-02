import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { FeedbackForm } from './components/FeedbackForm';
import { Analytics } from './components/Analytics';

const inter = Inter({ subsets: ['latin'] });

/**
 * Root layout — V3.
 *
 * Preserves:
 *  - GA4 Analytics component (G-QL011FYKSR — initialized once here only)
 *  - metadataBase pointing to https://denialcodepro.com
 *  - SiteHeader, SiteFooter, FeedbackForm
 *  - Inter font
 *
 * Default metadata applies to every page that does not override it.
 * Individual pages should set their own title/description/canonical.
 */
export const metadata: Metadata = {
  metadataBase: new URL('https://denialcodepro.com'),
  title: {
    default: 'DenialCodePro — Understand the denial. Know what to do next.',
    template: '%s — DenialCodePro',
  },
  description:
    'Reference information for U.S. medical billing denial codes. Search a denial code, remark code, or denial combination.',
  openGraph: {
    siteName: 'DenialCodePro',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
  // Robots default — individual pages may override
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <FeedbackForm />
          <SiteFooter />
        </div>
        {/*
          Analytics — GA4 G-QL011FYKSR.
          Initialized here and ONLY here. Do not add a second gtag script
          anywhere else in the application.
        */}
        <Analytics />
      </body>
    </html>
  );
}
