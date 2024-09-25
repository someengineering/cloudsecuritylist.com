import { getSiteSettings } from '@/lib/sanity';
import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { url } = (await getSiteSettings()) ?? {};
  
  return {
    rules:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        ? [
            { userAgent: '*', allow: '/' },
            {
              userAgent: '*',
              allow: '/',
              disallow: [
                '/*.json$',
                '/*_buildManifest.js$',
                '/*_middlewareManifest.js$',
                '/*_ssgManifest.js$',
                '/*.js$',
                '/studio',
              ],
            },
          ]
        : { userAgent: '*', disallow: '/' },
    sitemap:
      process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
        ? `${url}/sitemap.xml`
        : undefined,
  };
}
