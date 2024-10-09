import 'server-only';

import { getSiteSettings } from '@/lib/sanity';

export const isExternalLink = async (href: string) => {
  if (href.startsWith('/') || !href.includes('http')) {
    return false;
  }

  return href === (await transformUrl(href));
};

export const transformUrl = async (href: string) => {
  const siteSettings = await getSiteSettings();
  const url = siteSettings?.url ? new URL(siteSettings.url) : null;

  return url && href.includes(url.host)
    ? href.slice(href.indexOf(url.host) + url.host.length) || '/'
    : href;
};
