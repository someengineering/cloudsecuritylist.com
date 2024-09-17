import { CLOUD_PROVIDER } from '@/lib/sanity/queries/fragments/cloudProvider';
import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const CLOUD_PROVIDER_SLUGS_QUERY = groq`
  *[
    _type == "cloudProvider"
  ].slug.current
`;

export const CLOUD_PROVIDERS_QUERY = groq`
  *[
    _type == "cloudProvider" &&
    lower(name) > lower($prev)
  ] | order(lower(name) asc) {
    ${CLOUD_PROVIDER}
  }
`;

export const CLOUD_PROVIDER_QUERY = groq`
  *[
    _type == "cloudProvider" &&
    slug.current == $slug
  ] [0] {
    ${CLOUD_PROVIDER}
    "vendors": *[_type == "organization" && references(^._id)] | order(lower(name) asc) {
      ${ORGANIZATION_BASE}
    }
  }
`;
