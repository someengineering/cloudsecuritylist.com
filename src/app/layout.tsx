import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#0891b2',
  colorScheme: 'only light',
};

export const metadata: Metadata = {
  icons: [
    {
      url: '/favicon.ico',
      type: 'image/x-icon',
      sizes: '16x16 32x32',
    },
    {
      url: '/icon.svg',
      type: 'image/svg+xml',
      sizes: 'any',
    },
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
