import { PAGE } from '@/lib/sanity/queries/fragments/page';
import { groq } from 'next-sanity';

export const SITE_URL_QUERY = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0].url
`;

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    name,
    shortName,
    tagline,
    description,
    url,
    copyright,
    navigation[] { name, href },
    footerLinks[] { name, href, nofollow },
    heroTitle[0],
    heroDescription[],
    featuredPages[] -> { ${PAGE} }
  }
`;
