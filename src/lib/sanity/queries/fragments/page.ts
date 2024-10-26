import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const PAGE = groq`
  "slug": slug.current,
  title,
  description,
  "icon": icon.name,
  unlisted,
  nofollow
`;

// @sanity-typegen-ignore
export const PAGE_UPDATED_AT = groq`
  [
    _updatedAt,
    select(defined(listType) => *[_type == ^.listType] | order(_updatedAt desc) [0]._updatedAt)
  ] [defined(@)] | order(@ desc) [0]
`;
