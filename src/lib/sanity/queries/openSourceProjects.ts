import { OPEN_SOURCE_PROJECT } from '@/lib/sanity/queries/fragments/openSourceProject';
import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import { groq } from 'next-sanity';

export const OPEN_SOURCE_PROJECTS_QUERY = groq`
  *[
    _type == "openSourceProject"
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
    ${OPEN_SOURCE_PROJECT}
    organization -> { ${ORGANIZATION_BASE} },
  }
`;
