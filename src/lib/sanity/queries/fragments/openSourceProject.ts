import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const OPEN_SOURCE_PROJECT = groq`
  _id,
  "slug": slug.current,
  name,
  description,
  repository,
  mark,
  logo,
`;
