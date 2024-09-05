import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { groq } from 'next-sanity';

export const PRODUCT_CATEGORIES_QUERY = groq`
  *[
    _type == "productCategory" &&
    count(*[_type == "organization" && references(^._id)]) > 0
  ] | order(lower(name) asc) [0...20] {
    ${PRODUCT_CATEGORY}
  }
`;

export const PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERY = groq`
  *[
    _type == "productCategory" &&
    count(*[_type == "organization" && references(^._id)]) > 0 &&
    references($marketSegment)
  ] | order(lower(name) asc) [0...20] {
    ${PRODUCT_CATEGORY}
  }
`;

export const PRODUCT_CATEGORY_QUERY = groq`
  *[
    _type == "productCategory" &&
    slug.current == $slug
  ] [0] {
    ${PRODUCT_CATEGORY}
  }
`;
