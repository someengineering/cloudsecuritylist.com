import {
  ACQUIRED_ENTITY,
  ORGANIZATION,
  ORGANIZATION_BASE,
  ORGANIZATION_UPDATED_AT,
  VENDOR,
} from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const ORGANIZATION_SLUGS_QUERY = groq`
  *[
    _type == "organization" &&
    defined(slug.current) &&
    organizationType != "acquired"
  ].slug.current
`;

export const ORGANIZATION_QUERY = groq`
  *[
    _type == "organization" &&
    slug.current == $slug
  ][0] {
    _createdAt,
    "_updatedAt": ${ORGANIZATION_UPDATED_AT},
    ${ORGANIZATION}
  } { ..., "_updatedAt": _updatedAt | order(coalesce(timestamp, "") desc) [0].timestamp }
`;

export const VENDORS_COUNT_QUERY = groq`
  count(
    *[
      _type == "organization" &&
      organizationType != "acquired" &&
      count(productCategories) > 0 &&
      (count($productCategories) == 0 || references($productCategories)) &&
      (count($organizationTypes) == 0 || organizationType in $organizationTypes) &&
      (count($supportedCloudProviders) == 0 || references($supportedCloudProviders))
    ]
  )
`;

export const VENDORS_QUERY = groq`
  *[
    _type == "organization" &&
    organizationType != "acquired" &&
    count(productCategories) > 0 &&
    (count($productCategories) == 0 || references($productCategories)) &&
    (count($organizationTypes) == 0 || organizationType in $organizationTypes) &&
    (count($supportedCloudProviders) == 0 || references($supportedCloudProviders)) &&
    (
      length($searchQuery) == 0 ||
      name match $searchQuery + "*" ||
      description match $searchQuery + "*" ||
      string::split(array::join(string::split(website, "https://"), ""), "/")[0] match $searchQuery + "*"
    ) &&
    lower(name) > lower($prev)
  ] | order(lower(name) asc) [0...20] {
    ${VENDOR}
  }
`;

export const UNPAGINATED_VENDORS_QUERY = groq`
  *[
    _type == "organization" &&
    organizationType != "acquired" &&
    count(productCategories) > 0 &&
    (count($productCategories) == 0 || references($productCategories)) &&
    (count($organizationTypes) == 0 || organizationType in $organizationTypes) &&
    (count($supportedCloudProviders) == 0 || references($supportedCloudProviders)) &&
    (
      length($searchQuery) == 0 ||
      name match $searchQuery + "*" ||
      description match $searchQuery + "*" ||
      string::split(array::join(string::split(website, "https://"), ""), "/")[0] match $searchQuery + "*"
    )
  ] | order(lower(name) asc) {
    ${VENDOR}
  }
`;

export const ACQUISITIONS_QUERY = groq`
  *[
    _type == "organization" &&
    organizationType == "acquired" &&
    (
      ($prevDate == "" && $prevId == "") ||
      acquisitionDate < $prevDate ||
      (acquisitionDate == $prevDate && _id > $prevId)
    )
  ] | order(acquisitionDate desc) [0...20] {
    ${ACQUIRED_ENTITY}
    parentOrganization -> {
      ${ORGANIZATION_BASE}
    },
  }
`;

export const UNPAGINATED_ACQUISITIONS_QUERY = groq`
  *[
    _type == "organization" &&
    organizationType == "acquired"
  ] | order(acquisitionDate desc) {
    ${ACQUIRED_ENTITY}
    parentOrganization -> {
      ${ORGANIZATION_BASE}
    },
  }
`;
