import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const CLOUD_PROVIDER = groq`
  _id,
  "slug": slug.current,
  name,
  abbreviation,
  description,
  "icon": icon.name,
  mark,
  logo,
  website,
  linkedin
`;

// @sanity-typegen-ignore
export const CLOUD_PROVIDER_UPDATED_AT = groq`
  [
    _updatedAt,
    *[_type == "organization" && organizationType != "acquired" && ^._id in supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt,
    *[_type == "openSourceProject" && ^._id in supportedCloudProviders[]._ref] | order(_updatedAt desc) [0]._updatedAt
  ] [defined(@)] | order(@ desc) [0]
`;
