import { PAGE } from '@/lib/sanity/queries/fragments/page';
import { groq } from 'next-sanity';

export const PAGE_SLUGS_QUERY = groq`
  *[
    _type == "page" &&
    defined(slug.current)
  ].slug.current
`;

export const PAGES_QUERY = groq`
  *[
    _type == "page" &&
    defined(slug.current)
  ] {
    ${PAGE}
  }
`;

export const PAGE_QUERY = groq`
  *[
    _type == "page" &&
    slug.current == $slug
  ] [0] {
    ${PAGE}
  }
`;
