import { OPEN_SOURCE_PROJECT_BASE } from '@/lib/sanity/queries/fragments/openSourceProject';
import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import {
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_UPDATED_AT,
} from '@/lib/sanity/queries/fragments/productCategory';
import { groq } from 'next-sanity';

export const PRODUCT_CATEGORY_SLUGS_QUERY = groq`
  *[_type == "productCategory" && defined(slug.current)].slug.current
`;

export const PRODUCT_CATEGORIES_QUERY = groq`
  *[
    _type == "productCategory" &&
    ($marketSegment == "" || $marketSegment == marketSegment._ref) &&
    (length($referenceType) == 0 || count(*[_type == $referenceType && references(^._id)]) > 0)
  ] | order(lower(name) asc) {
    ${PRODUCT_CATEGORY}
  }
`;

export const PRODUCT_CATEGORY_QUERY = groq`
  *[_type == "productCategory" && slug.current == $slug][0] {
    _createdAt,
    "_updatedAt": ${PRODUCT_CATEGORY_UPDATED_AT},
    ${PRODUCT_CATEGORY},
    explanationHeading,
    explanation[],
    "vendors": *[_type == "organization" && organizationType != "acquired" && ^._id in productCategories[]._ref] | order(lower(name) asc) {
      ${ORGANIZATION_BASE}
    },
    "openSourceProjects": *[_type == "openSourceProject" && ^._id in productCategories[]._ref] | order(lower(name) asc) {
      ${OPEN_SOURCE_PROJECT_BASE}
    },
    similarCategories[] -> { ${PRODUCT_CATEGORY} }
  }
`;
