import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { sanityFetch } from '@/lib/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries/siteSettings';
import { SITE_SETTINGS_QUERYResult } from '@/lib/sanity/types';
import '@/styles/globals.css';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { title, navigation, copyright } =
    (await sanityFetch<SITE_SETTINGS_QUERYResult>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    })) ?? {};

  return (
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="bg-white">
        <Header title={title} navigation={navigation} />
        {children}
        <Footer copyright={copyright} navigation={navigation} />
      </body>
    </html>
  );
}
