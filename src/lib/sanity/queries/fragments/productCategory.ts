import { MARKET_SEGMENT_BASE } from '@/lib/sanity/queries/fragments/marketSegment';
import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const PRODUCT_CATEGORY = groq`
  _id,
  "slug": slug.current,
  name,
  expansion,
  description,
  marketSegment -> { ${MARKET_SEGMENT_BASE} }
`;

// @sanity-typegen-ignore
export const PRODUCT_CATEGORY_UPDATED_AT = groq`
  [
    _updatedAt,
    *[_type == "marketSegment" && _id == ^.marketSegment._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "organization" && organizationType != "acquired" && ^._id in productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "openSourceProject" && ^._id in productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "productCategory" && _id in ^.similarCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt
  ] [defined(@)] | order(@ desc) [0]
`;
