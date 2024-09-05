import { sanityFetch } from '@/lib/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries/siteSettings';
import { SITE_SETTINGS_QUERYResult } from '@/lib/sanity/types';
import '@/styles/globals.css';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } =
    (await sanityFetch<SITE_SETTINGS_QUERYResult>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    })) ?? {};

  return {
    title: {
      default: title ?? 'Cloud Security List',
      template: `%s | ${title}`,
    },
    description,
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
