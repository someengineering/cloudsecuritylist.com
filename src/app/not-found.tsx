import '@/styles/globals.css';

import { notoSans } from '@/app/font';
import FeaturedPages from '@/components/content/FeaturedPages';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import PageHeader from '@/components/page/Header';
import { getSiteSettings } from '@/lib/sanity';
import clsx from 'clsx';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Script from 'next/script';

const title = 'Page not found';
const description =
  'Oh no! This page seems to have evaporated into the cloud. Even our most advanced threat detection can’t locate it.';

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
};

export default async function NotFoundPage() {
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const { name, navigation, featuredPages, footerLinks, copyright } =
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
        <main>
          <PageHeader
            title="Page not found"
            eyebrow="404"
            description="Oh no! This page seems to have evaporated into the cloud. Even our most advanced threat detection can’t locate it."
          />
          <FeaturedPages pages={featuredPages ?? []} homeLink={true} />
        </main>
        <Footer copyright={copyright} links={footerLinks} />
      </body>
    </html>
  );
}
