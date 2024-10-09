import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const MARKET_SEGMENT_BASE = groq`
  _id,
  "slug": slug.current,
  name,
  description,
  "icon": icon.name
`;

// @sanity-typegen-ignore
export const MARKET_SEGMENT = groq`
  ${MARKET_SEGMENT_BASE},
  "productCategories": *[_type == "productCategory" && marketSegment._ref == ^._id] | order(lower(name) asc) {
    _id,
    name,
    "slug": slug.current,
    expansion
  },
`;
