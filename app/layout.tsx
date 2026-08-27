import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './tailwind.css';
import './globals.css';
import './typography.css';
import './header-effects.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-serif', weight: ['500','600'] });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL('https://danielcharlesevans.com'),
  title: {
    default: 'Daniel Charles Evans | Financial Advisor and Broker',
    template: '%s | Daniel Charles Evans',
  },
  description:
    'Financial advice and brokerage services from Daniel Charles Evans, including portfolio strategy, retirement planning, wealth preservation and risk management.',
  keywords: [
    'Daniel Charles Evans',
    'financial advisor and broker',
    'investment planning',
    'portfolio strategy',
    'retirement planning',
    'wealth preservation',
    'portfolio review',
    'risk management',
  ],
  authors: [{ name: 'Daniel Charles Evans' }],
  creator: 'Daniel Charles Evans',
  publisher: 'Daniel Charles Evans Advisory',
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/daniel-charles-evans.jpeg', type: 'image/jpeg' }],
    shortcut: '/daniel-charles-evans.jpeg',
    apple: '/daniel-charles-evans.jpeg',
  },
  openGraph: {
    title: 'Daniel Charles Evans | Financial Advisor and Broker',
    description:
      'Personal, research-led investment advice designed to help you build, manage and preserve wealth with confidence.',
    url: '/',
    siteName: 'Daniel Charles Evans Advisory',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/daniel-charles-evans.jpeg',
        alt: 'Daniel Charles Evans, financial advisor and broker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daniel Charles Evans | Financial Advisor and Broker',
    description:
      'Personal investment advice for portfolio strategy, retirement planning and long-term wealth preservation.',
    images: ['/daniel-charles-evans.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
