import { getSitemapData } from '@/lib/sanity';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapData = await getSitemapData();

  if (!sitemapData) {
    return [];
  }

  return [
    {
      url: `${sitemapData.baseUrl}`,
    },
    ...sitemapData.items.map((item) => ({
      url: `${sitemapData.baseUrl}${item.url}`,
      lastModified: new Date(
        Math.max(...item.lastModified.map((date) => new Date(date).getTime())),
      ),
    })),
  ];
}
