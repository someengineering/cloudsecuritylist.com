import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const CLOUD_PROVIDER = groq`
  _id,
  "slug": slug.current,
  name,
  abbreviation,
  description,
  "icon": icon.name,
  mark,
  logo,
  website,
  linkedin,
`;
