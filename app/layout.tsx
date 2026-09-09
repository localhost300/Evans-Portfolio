import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './tailwind.css';
import './globals.css';
import './typography.css';
import './header-effects.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-serif', weight: ['500','600'] });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });

const siteUrl = 'https://danielcharlesevans.online';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'Daniel Charles Evans Advisory',
      inLanguage: 'en',
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#daniel-charles-evans`,
      name: 'Daniel Charles Evans',
      url: siteUrl,
      image: `${siteUrl}/daniel-charles-evans.jpeg`,
      jobTitle: 'Financial Advisor and Broker',
      email: 'mailto:contact@danielcharlesevans.online',
      sameAs: [
        'https://reports.adviserinfo.sec.gov/reports/individual/individual_2302549.pdf',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${siteUrl}/#business`,
      name: 'Daniel Charles Evans Advisory',
      url: siteUrl,
      image: `${siteUrl}/daniel-charles-evans.jpeg`,
      email: 'contact@danielcharlesevans.online',
      description:
        'Personal financial advisory and brokerage services, including investment management, retirement planning, wealth preservation and business financial consulting.',
      founder: { '@id': `${siteUrl}/#daniel-charles-evans` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  category: 'financial services',
  alternates: { canonical: '/' },
  icons: {
    icon: { url: '/favicon.svg', type: 'image/svg+xml' },
    shortcut: '/favicon.svg',
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
        width: 1138,
        height: 1280,
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
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
      </body>
    </html>
  );
}
