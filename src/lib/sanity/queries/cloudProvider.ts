import {
  CLOUD_PROVIDER,
  CLOUD_PROVIDER_UPDATED_AT,
} from '@/lib/sanity/queries/fragments/cloudProvider';
import { OPEN_SOURCE_PROJECT_BASE } from '@/lib/sanity/queries/fragments/openSourceProject';
import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const CLOUD_PROVIDER_SLUGS_QUERY = groq`
  *[_type == "cloudProvider" && defined(slug.current)].slug.current
`;

export const CLOUD_PROVIDERS_QUERY = groq`
  *[_type == "cloudProvider"] | order(lower(name) asc) { ${CLOUD_PROVIDER} }
`;

export const CLOUD_PROVIDER_QUERY = groq`
  *[_type == "cloudProvider" && slug.current == $slug][0] {
    _createdAt,
    "_updatedAt": ${CLOUD_PROVIDER_UPDATED_AT},
    ${CLOUD_PROVIDER},
    sharedResponsibilityModel,
    nativeProducts[] {
      name,
      description,
      link,
    },
    "vendors": *[_type == "organization" && organizationType != "acquired" && ^._id in supportedCloudProviders[]._ref] | order(lower(name) asc) {
      ${ORGANIZATION_BASE}
    },
    "openSourceProjects": *[_type == "openSourceProject" && ^._id in supportedCloudProviders[]._ref] | order(lower(name) asc) {
      ${OPEN_SOURCE_PROJECT_BASE},
      organization -> { ${ORGANIZATION_BASE} }
    }
  }
`;
