import { CLOUD_PROVIDER } from '@/lib/sanity/queries/fragments/cloudProvider';
import { OPEN_SOURCE_PROJECT_BASE } from '@/lib/sanity/queries/fragments/openSourceProject';
import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { RESEARCH } from '@/lib/sanity/queries/fragments/research';
import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const ORGANIZATION_BASE = groq`
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
  logo
`;

// @sanity-typegen-ignore
export const VENDOR = groq`
  ${ORGANIZATION_BASE},
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  supportedCloudProviders[] -> { ${CLOUD_PROVIDER} }
`;

// @sanity-typegen-ignore
export const ACQUIRED_ENTITY = groq`
  ${ORGANIZATION_BASE},
  acquisitionDate,
  acquisitionPrice,
  pressRelease
`;

// @sanity-typegen-ignore
export const NON_ACQUIRED_ENTITY = groq`
  ${ORGANIZATION_BASE},
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  supportedCloudProviders[] -> { ${CLOUD_PROVIDER} },
  ...(*[_type == "openSourceProject" && organization.ref == ^.id && name == ^.name] [0] {
    ...select(
      repository match "*github.com" => { "github": repository },
      repository match "*gitlab.com" => { "gitlab": repository },
    )
  }),
  "openSourceProjects": *[_type == "openSourceProject" && organization._ref == ^._id && name != ^.name] {
    ${OPEN_SOURCE_PROJECT_BASE},
    organization -> { ${ORGANIZATION_BASE} }
  },
  "research": *[_type == "research" && organization._ref == ^._id] {
    ${RESEARCH}
  },
  "acquiredEntities": *[_type == "organization" && parentOrganization._ref == ^._id] | order(acquisitionDate desc) {
    ${ACQUIRED_ENTITY}
  }
`;

// @sanity-typegen-ignore
export const ORGANIZATION = groq`
  ...select(
    organizationType == "acquired" => {
      ${ACQUIRED_ENTITY},
      parentOrganization -> { ${ORGANIZATION_BASE} },
    },
    organizationType != "acquired" => { ${NON_ACQUIRED_ENTITY} }
  )
`;

// @sanity-typegen-ignore
export const ORGANIZATION_UPDATED_AT = groq`
  [
    _updatedAt,
    *[_type == "organization" && organizationType == "acquired" && parentOrganization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "productCategory" && _id in ^.productCategories[]._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "cloudProvider" && _id in ^.supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "openSourceProject" && organization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "research" && organization._ref == ^._id] | order(_updatedAt desc) [0]._updatedAt
  ] [defined(@)] | order(@ desc) [0]
`;
