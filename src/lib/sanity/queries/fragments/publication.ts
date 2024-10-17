import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const PUBLICATION = groq`
  name,
  description,
  author,
  website,
  mark
`;
