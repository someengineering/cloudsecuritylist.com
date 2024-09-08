import { ORGANIZATION } from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const ORGANIZATIONS_COUNT_QUERY = groq`
  count(
    *[
      _type == "organization" &&
      (count($organizationTypes) == 0 || organizationType in $organizationTypes)
    ]
  )
`;

export const ORGANIZATION_SLUGS_QUERY = groq`
  *[
    _type == "organization"
  ].slug.current
`;

export const ORGANIZATIONS_QUERY = groq`
  *[
    _type == "organization" &&
    (count($organizationTypes) == 0 || organizationType in $organizationTypes) &&
    lower(name) > lower($prev)
  ] | order(lower(name) asc) [0...20] {
    ${ORGANIZATION}
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
      count(productCategories) > 0 &&
      (count($productCategories) == 0 || references($productCategories)) &&
      (count($organizationTypes) == 0 || organizationType in $organizationTypes)
    ]
  )
`;

export const VENDORS_QUERY = groq`
  *[
    _type == "organization" &&
    count(productCategories) > 0 &&
    (count($productCategories) == 0 || references($productCategories)) &&
    (count($organizationTypes) == 0 || organizationType in $organizationTypes) &&
    lower(name) > lower($prev)
  ] | order(lower(name) asc) [0...20] {
    ${ORGANIZATION}
  }
`;
