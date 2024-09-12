import { CLOUD_PROVIDER } from '@/lib/sanity/queries/fragments/cloudProvider';
import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { RESEARCH } from '@/lib/sanity/queries/fragments/research';

export const ORGANIZATION_BASE = `
  _id,
  name,
  "slug": slug.current,
  description,
  mark,
  logo,
  website,
  linkedin,
  crunchbase,
`;

export const ORGANIZATION = `
  ${ORGANIZATION_BASE}
  organizationType,
  stockSymbol,
  supportedCloudProviders[] -> { ${CLOUD_PROVIDER} },
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  "research": *[_type == "research" && organization._ref == ^._id] {
    ${RESEARCH}
  },
  "acquiredOrganizations": *[_type == "organization" && parentOrganization._ref == ^._id] {
    ${ORGANIZATION_BASE}
  },
`;
