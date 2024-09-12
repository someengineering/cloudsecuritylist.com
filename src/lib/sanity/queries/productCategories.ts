import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { groq } from 'next-sanity';

export const PRODUCT_CATEGORY_SLUGS_QUERY = groq`
  *[
    _type == "productCategory"
  ].slug.current
`;

export const PRODUCT_CATEGORIES_QUERY = groq`
  *[
    _type == "productCategory" &&
    ($marketSegment == "" || references($marketSegment))
  ] | order(lower(name) asc) {
    ${PRODUCT_CATEGORY}
  }
`;

export const PRODUCT_CATEGORY_QUERY = groq`
  *[
    _type == "productCategory" &&
    slug.current == $slug
  ] [0] {
    ${PRODUCT_CATEGORY}
    "vendors": *[_type == "organization" && references(^._id)] | order(lower(name) asc) {
      ${ORGANIZATION_BASE}
    }
  }
`;
