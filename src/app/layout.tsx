import { getSiteSettings } from '@/lib/sanity';
import '@/styles/globals.css';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description, url } = (await getSiteSettings()) ?? {};

  return {
    title: {
      default: title ?? '',
      template: `%s | ${title}`,
    },
    description,
    metadataBase: url ? new URL(url) : undefined,
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
