import { getSiteSettings } from '@/lib/sanity';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

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
    <html lang="en" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="bg-white">{children}</body>
    </html>
  );
}
