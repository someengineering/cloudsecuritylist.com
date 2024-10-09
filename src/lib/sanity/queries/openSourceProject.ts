import {
  OPEN_SOURCE_PROJECT,
  OPEN_SOURCE_PROJECT_UPDATED_AT,
} from '@/lib/sanity/queries/fragments/openSourceProject';
import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const OPEN_SOURCE_PROJECT_SLUGS_QUERY = groq`
  *[
    _type == "openSourceProject" &&
    defined(slug.current) &&
    name != organization->name
  ].slug.current
`;

export const OPEN_SOURCE_PROJECTS_QUERY = groq`
  *[
    _type == "openSourceProject" &&
    (count($productCategories) == 0 || references($productCategories)) &&
    (count($supportedCloudProviders) == 0 || references($supportedCloudProviders)) &&
    (
      length($searchQuery) == 0 ||
      name match $searchQuery + "*" ||
      description match $searchQuery + "*" ||
      organization.name match $searchQuery + "*" ||
      array::join(string::split(array::join(string::split(repository, "https://"), ""), "/")[1..2], "/") match $searchQuery + "*"
    ) &&
    lower(name) > lower($prev)
  ] | order(lower(name) asc) [0...20] {
    ${OPEN_SOURCE_PROJECT}
    organization -> { ${ORGANIZATION_BASE} },
  }
`;

export const UNPAGINATED_OPEN_SOURCE_PROJECTS_QUERY = groq`
  *[
    _type == "openSourceProject" &&
    (count($productCategories) == 0 || references($productCategories)) &&
    (count($supportedCloudProviders) == 0 || references($supportedCloudProviders)) &&
    (
      length($searchQuery) == 0 ||
      name match $searchQuery + "*" ||
      description match $searchQuery + "*" ||
      organization.name match $searchQuery + "*" ||
      array::join(string::split(array::join(string::split(repository, "https://"), ""), "/")[1..2], "/") match $searchQuery + "*"
    )
  ] | order(lower(name) asc) {
    ${OPEN_SOURCE_PROJECT}
    organization -> { ${ORGANIZATION_BASE} },
  }
`;

export const OPEN_SOURCE_PROJECT_QUERY = groq`
  *[
    _type == "openSourceProject" &&
    slug.current == $slug
  ][0] {
    _createdAt,
    "_updatedAt": ${OPEN_SOURCE_PROJECT_UPDATED_AT},
    ${OPEN_SOURCE_PROJECT}
    organization -> { ${ORGANIZATION_BASE} },
  } { ..., "_updatedAt": coalesce(_updatedAt | order(coalesce(timestamp, "") desc) [0].timestamp, "") }
`;
