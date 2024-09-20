import { CLOUD_PROVIDER } from '@/lib/sanity/queries/fragments/cloudProvider';
import { VENDOR } from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const CLOUD_PROVIDER_SLUGS_QUERY = groq`
  *[
    _type == "cloudProvider" &&
    defined(slug.current)
  ].slug.current
`;

export const CLOUD_PROVIDERS_QUERY = groq`
  *[
    _type == "cloudProvider"
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
    "vendors": *[
      _type == "organization" && ^._id in supportedCloudProviders[]._ref
    ] | order(lower(name) asc) {
      ${VENDOR}
    }
  }
`;
