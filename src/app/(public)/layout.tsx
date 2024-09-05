import Header from '@/components/layout/Header';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: 'Cloud Security List',
  description:
    'Cloud security engineers are notoriously overworked and under-resourced. This curated list of tools, frameworks, and resources makes their lives easier.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="bg-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
