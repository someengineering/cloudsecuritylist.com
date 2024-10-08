import '@/styles/globals.css';

import { notoSans } from '@/app/font';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getSiteSettings } from '@/lib/sanity';
import clsx from 'clsx';
import { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';

export async function generateMetadata(): Promise<Metadata> {
  const { name, tagline, description, url } = (await getSiteSettings()) ?? {};

  return {
    title: {
      default: `${name}: ${tagline}`,
      template: `%s | ${name}`,
    },
    description,
    applicationName: name,
    metadataBase:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' && url
        ? new URL(url)
        : undefined,
    robots:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        ? { index: true, follow: true }
        : { index: false, follow: false },
    openGraph: {
      siteName: name,
      type: 'website',
      locale: 'en_US',
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { name, navigation, copyright } = (await getSiteSettings()) ?? {};

  return (
    <html lang="en" className={clsx('h-full scroll-smooth', notoSans.variable)}>
      <head>
        <PlausibleProvider domain="cloudsecuritylist.com" trackOutboundLinks />
      </head>
      <body className="bg-white">
        <Header title={name} navigation={navigation} />
        <main>{children}</main>
        <Footer copyright={copyright} navigation={navigation} />
      </body>
    </html>
  );
}
