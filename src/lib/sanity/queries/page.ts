import { PAGE, PAGE_UPDATED_AT } from '@/lib/sanity/queries/fragments/page';
import { groq } from 'next-sanity';

export const PAGE_SLUGS_QUERY = groq`*[_type == "page" && defined(slug.current) && defined(textContent) && unlisted != true].slug.current | order(@ asc)`;

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _createdAt,
    "_updatedAt": ${PAGE_UPDATED_AT},
    ${PAGE},
    ...select(!defined(listType) => { longTitle, textContent[], displayUpdatedAt })
  }
`;
