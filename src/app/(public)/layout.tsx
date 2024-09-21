import '@/styles/globals.css';

import { plusJakartaSans } from '@/app/font';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { getSiteSettings } from '@/lib/sanity';
import { clsx } from 'clsx';
import { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, url } = (await getSiteSettings()) ?? {};

  return {
    title: {
      default: title ?? '',
      template: `%s | ${title}`,
    },
    description,
    metadataBase: url ? new URL(url) : undefined,
    robots:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        ? { index: true, follow: true }
        : { index: false, follow: false },
    openGraph: {
      siteName: title,
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
  const { title, navigation, copyright } = (await getSiteSettings()) ?? {};

  return (
    <html
      lang="en"
      className={clsx('h-full scroll-smooth', plusJakartaSans.variable)}
    >
      <head>
        <PlausibleProvider domain="cloudsecuritylist.com" trackOutboundLinks />
      </head>
      <body className="bg-white">
        <Header title={title} navigation={navigation} />
        <main>{children}</main>
        <Footer copyright={copyright} navigation={navigation} />
      </body>
    </html>
  );
}
