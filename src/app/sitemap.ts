import { getSitemap } from '@/lib/sanity';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap = await getSitemap();

  if (!sitemap) {
    return [];
  }

  return sitemap.map((loc) => ({
    url: loc.url,
    lastModified: loc.lastModified ? new Date(loc.lastModified) : undefined,
  }));
}
