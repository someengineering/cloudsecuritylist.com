import { getSitemap } from '@/lib/sanity';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return (await getSitemap()) ?? [];
}
