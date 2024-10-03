import { getSiteSettings } from '@/lib/sanity';
import 'server-only';

export const transformUrl = async (href: string) => {
  const siteSettings = await getSiteSettings();
  const url = siteSettings?.url ? new URL(siteSettings.url) : null;

  return url && href.includes(url.host)
    ? href.slice(href.indexOf(url.host) + url.host.length) || '/'
    : href;
};
