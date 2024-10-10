import 'server-only';

import { getSiteUrl } from '@/lib/sanity';

export const isExternalLink = async (href: string) => {
  try {
    const url = new URL(href);
    const siteUrl = await getSiteUrl();

    return !siteUrl || url.host !== new URL(siteUrl).host.replace('www.', '');
  } catch {
    return false;
  }
};

export const transformUrl = async (href: string) => {
  try {
    const url = new URL(href);
    const siteUrl = await getSiteUrl();

    return url.host === new URL(siteUrl ?? '').host.replace('www.', '')
      ? `${url.pathname}${url.search}${url.hash}`
      : href;
  } catch {
    return href.startsWith('/') ? href : `/${href}`;
  }
};
