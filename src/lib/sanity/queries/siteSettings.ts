import { PAGE } from '@/lib/sanity/queries/fragments/page';
import { groq } from 'next-sanity';

export const SITE_SETTINGS_QUERY = groq`
  *[
    _type == "siteSettings" &&
    _id == "siteSettings"
  ] [0] {
    title,
    description,
    url,
    copyright,
    navigation[] {
      name,
      href,
    },
    headline,
    subheadline,
    featuredPages[] -> {
      ${PAGE}
    }
  }
`;
