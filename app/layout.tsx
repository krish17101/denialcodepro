import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { Analytics } from './components/Analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DenialCode Pro — Medical Denial Code Lookup & Solutions',
  description:
    'Search medical billing denial codes and adjustment codes. Get official problem descriptions and step-by-step solutions to fix and appeal every claim.',
  metadataBase: new URL('https://denialcodepro.com'),
  openGraph: {
    title: 'DenialCode Pro — Medical Denial Code Lookup & Solutions',
    description:
      'Search denial codes and adjustment codes with official descriptions and actionable solutions to fix every claim.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DenialCode Pro — Medical Denial Code Lookup & Solutions',
    description:
      'Search denial codes and adjustment codes with actionable solutions.',
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
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
