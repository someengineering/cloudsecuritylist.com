import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const RESEARCH = groq`
  name,
  description,
  website
`;
