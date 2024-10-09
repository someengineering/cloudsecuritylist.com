import { PAGE, PAGE_UPDATED_AT } from '@/lib/sanity/queries/fragments/page';
import { groq } from 'next-sanity';

export const PAGE_SLUGS_QUERY = groq`
*[
  _type == "page" &&
  defined(slug.current) &&
  !defined(listType) &&
  defined(textContent) &&
  (!defined(unlisted) || unlisted == false)
].slug.current
`;

export const PAGE_QUERY = groq`
  *[
    _type == "page" &&
    slug.current == $slug
  ][0] {
    _createdAt,
    "_updatedAt": ${PAGE_UPDATED_AT},
    ${PAGE}
  } { ..., "_updatedAt": coalesce(_updatedAt | order(coalesce(timestamp, "") desc) [0].timestamp, "") }
`;
