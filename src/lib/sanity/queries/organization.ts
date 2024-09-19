import {
  ORGANIZATION,
  ORGANIZATION_BASE,
  VENDOR,
} from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const ORGANIZATIONS_COUNT_QUERY = groq`
  count(
    *[
      _type == "organization" &&
      organizationType != "acquired" &&
      (count($organizationTypes) == 0 || organizationType in $organizationTypes)
    ]
  )
`;

export const ORGANIZATION_SLUGS_QUERY = groq`
  *[
    _type == "organization" &&
    defined(slug.current) &&
    organizationType != "acquired"
  ].slug.current
`;

export const ORGANIZATIONS_QUERY = groq`
  *[
    _type == "organization" &&
    organizationType != "acquired" &&
    (count($organizationTypes) == 0 || organizationType in $organizationTypes) &&
    lower(name) > lower($prev)
  ] | order(lower(name) asc) [0...20] {
    ${ORGANIZATION_BASE}
  }
`;

export const ORGANIZATION_QUERY = groq`
  *[
    _type == "organization" &&
    slug.current == $slug
  ] [0] {
    ${ORGANIZATION}
  }
`;

export const VENDORS_COUNT_QUERY = groq`
  count(
    *[
      _type == "organization" &&
      organizationType != "acquired" &&
      count(productCategories) > 0 &&
      (count($productCategories) == 0 || references($productCategories)) &&
      (count($organizationTypes) == 0 || organizationType in $organizationTypes)
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
    lower(name) > lower($prev)
  ] | order(lower(name) asc) [0...20] {
    ${VENDOR}
  }
`;