import { CLOUD_PROVIDER } from '@/lib/sanity/queries/fragments/cloudProvider';
import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const OPEN_SOURCE_PROJECT_BASE = groq`
  _id,
  "slug": slug.current,
  name,
  description,
  repository,
  mark,
  logo
`;

// @sanity-typegen-ignore
export const OPEN_SOURCE_PROJECT = groq`
  ${OPEN_SOURCE_PROJECT_BASE},
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  supportedCloudProviders[] -> { ${CLOUD_PROVIDER} }
`;

// @sanity-typegen-ignore
export const OPEN_SOURCE_PROJECT_UPDATED_AT = groq`
  [
    _updatedAt,
    *[_type == "organization" && organizationType == "acquired" && _id == ^.organization._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "productCategory" && _id in ^.productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "cloudProvider" && _id in ^.supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt
  ] [defined(@)] | order(@ desc) [0]
`;
