import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const PAGE = groq`
  "slug": slug.current,
  title,
  description,
  "icon": icon.name,
  ...select(!defined(listType) => { longTitle, textContent[] }),
`;
