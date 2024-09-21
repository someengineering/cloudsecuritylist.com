import { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#0891b2',
  colorScheme: 'only light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
