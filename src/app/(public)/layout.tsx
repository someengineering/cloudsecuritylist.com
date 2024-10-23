import '@/styles/globals.css';

import { notoSans } from '@/app/font';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getSiteSettings } from '@/lib/sanity';
import clsx from 'clsx';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';

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
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const { name, navigation, footerLinks, copyright } =
    (await getSiteSettings()) ?? {};

  return (
    <html lang="en" className={clsx('h-full scroll-smooth', notoSans.variable)}>
      <head>
        <Script
          src="/js/script.js"
          data-domain="cloudsecuritylist.com"
          strategy="afterInteractive"
          nonce={nonce}
        />
      </head>
      <body className="bg-white">
        <Header title={name} navigation={navigation} />
        <main>{children}</main>
        <Footer copyright={copyright} links={footerLinks} />
      </body>
    </html>
  );
}
