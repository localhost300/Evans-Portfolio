import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './tailwind.css';
import './globals.css';
import './typography.css';
import './header-effects.css';

const serif = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-serif', weight: ['500','600'] });
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: { default: 'Daniel Charles Evans | Independent Investment Adviser', template: '%s | Daniel Charles Evans' },
  description: 'Professional, personal investment advice to help you grow and safeguard your wealth.',
  keywords: ['investment adviser', 'financial planning', 'retirement strategy', 'portfolio review'],
  openGraph: { title: 'Daniel Charles Evans | Independent Investment Adviser', description: 'Professional investment advice aligned with your goals.', type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
