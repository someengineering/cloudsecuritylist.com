import 'server-only';

import { getSiteSettings } from '@/lib/sanity';

export const isExternalLink = async (href: string) => {
  try {
    const url = new URL(href);

    const siteSettings = await getSiteSettings();
    if (!siteSettings?.url) {
      return true;
    }

    return url.host !== new URL(siteSettings.url)?.host.replace('www.', '');
  } catch {
    return false;
  }
};

export const transformUrl = async (href: string) => {
  try {
    const url = new URL(href);

    const siteSettings = await getSiteSettings();
    if (!siteSettings?.url) {
      return href;
    }

    return url.host === new URL(siteSettings.url)?.host.replace('www.', '')
      ? `${url.pathname}${url.search}${url.hash}`
      : href;
  } catch {
    return href.startsWith('/') ? href : `/${href}`;
  }
};
