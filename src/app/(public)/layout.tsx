import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
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
  const { url } = (await getSiteSettings()) ?? {};

  return {
    robots:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' &&
      url === `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        ? { index: true, follow: true }
        : { index: false, follow: false },
  };
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { title, navigation, copyright } = (await getSiteSettings()) ?? {};

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
