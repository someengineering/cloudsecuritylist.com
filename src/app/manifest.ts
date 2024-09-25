import { getSiteSettings } from '@/lib/sanity';
import type { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { title: name, description } = (await getSiteSettings()) ?? {};

  return {
    name,
    description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#0891b2',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-mask.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
