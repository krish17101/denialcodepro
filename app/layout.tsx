import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { FeedbackForm } from './components/FeedbackForm';
import { analyticsProduction } from '../lib/public/analytics-environment';
import { Analytics } from './components/Analytics';

const inter = Inter({ subsets: ['latin'] });

/**
 * Root layout — V3.
 *
 * Preserves:
 *  - Optional production-only audience measurement
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
    'Original claim-investigation guides and an evidence checklist for U.S. medical billers.',
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
    // Next replaces this property at compile time, including in the server bundle.
    index: process.env.DCP_BUILD_INDEXABLE === 'yes',
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
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-4 focus:text-navy-900">Skip to main content</a>
        <div className="flex min-h-screen flex-col bg-slate-50">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <FeedbackForm />
          <SiteFooter />
        </div>
        <Analytics production={analyticsProduction(process.env)} />
      </body>
    </html>
  );
}
