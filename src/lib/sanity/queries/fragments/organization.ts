import { CLOUD_PROVIDER } from '@/lib/sanity/queries/fragments/cloudProvider';
import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { RESEARCH } from '@/lib/sanity/queries/fragments/research';

export const ORGANIZATION_BASE = `
  _id,
  "slug": slug.current,
  name,
  description,
  organizationType,
  website,
  linkedin,
  crunchbase,
  stockSymbol,
  mark,
  logo,
`;

export const VENDOR = `
  ${ORGANIZATION_BASE}
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  supportedCloudProviders[] -> { ${CLOUD_PROVIDER} },
`;

export const ACQUIRED_ENTITY = `
  ${ORGANIZATION_BASE}
  acquisitionDate,
  acquisitionPrice,
  pressRelease,
`;

export const NON_ACQUIRED_ENTITY = `
  ${ORGANIZATION_BASE}
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  supportedCloudProviders[] -> { ${CLOUD_PROVIDER} },
  "research": *[
    _type == "research" && organization._ref == ^._id
  ] {
    ${RESEARCH}
  },
  "acquiredEntities": *[
    _type == "organization" && parentOrganization._ref == ^._id
  ] | order(acquisitionDate desc) {
    ${ACQUIRED_ENTITY}
  },
`;

export const ORGANIZATION = `
  ...select(
    organizationType == "acquired" => {
      ${ACQUIRED_ENTITY}
      parentOrganization -> {
        ${ORGANIZATION_BASE}
      },
    },
    organizationType != "acquired" => {
      ${NON_ACQUIRED_ENTITY}
    },
  ),
`;
