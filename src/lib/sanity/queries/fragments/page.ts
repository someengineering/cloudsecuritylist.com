import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const PAGE = groq`
  "slug": slug.current,
  title,
  description,
  "icon": icon.name,
  ...select(!defined(listType) => { longTitle, textContent[] }),
`;

// @sanity-typegen-ignore
export const PAGE_UPDATED_AT = groq`
  [
    { "timestamp": _updatedAt },
    select(defined(listType) => { "timestamp": *[_type == ^.listType] | order(_updatedAt desc) [0]._updatedAt }),
  ]
`;
