import { VENDOR } from '@/lib/sanity/queries/fragments/organization';
import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { groq } from 'next-sanity';

export const PRODUCT_CATEGORY_SLUGS_QUERY = groq`
  *[
    _type == "productCategory" &&
    defined(slug.current)
  ].slug.current
`;

export const PRODUCT_CATEGORIES_QUERY = groq`
  *[
    _type == "productCategory" &&
    ($marketSegment == "" || $marketSegment == marketSegment._ref)
  ] | order(lower(name) asc) {
    ${PRODUCT_CATEGORY}
  }
`;

export const PRODUCT_CATEGORY_QUERY = groq`
  *[
    _type == "productCategory" &&
    slug.current == $slug
  ][0] {
    _createdAt,
    _updatedAt,
    ${PRODUCT_CATEGORY}
    explanationHeading,
    explanation[],
    "vendors": *[
      _type == "organization" && ^._id in productCategories[]._ref
    ] | order(lower(name) asc) {
      ${VENDOR}
    }
  }
`;
