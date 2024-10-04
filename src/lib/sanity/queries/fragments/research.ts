import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const RESEARCH = groq`
  _id,
  "slug": slug.current,
  name,
  description,
  website,
`;
