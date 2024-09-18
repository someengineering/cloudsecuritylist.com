import { ORGANIZATION } from '@/lib/sanity/queries/fragments/organization';
import { RESEARCH } from '@/lib/sanity/queries/fragments/research';
import { groq } from 'next-sanity';

export const RESEARCHES_QUERY = groq`
  *[
    _type == "research"
  ] | order(lower(name) asc) {
    ${RESEARCH}
    organization -> { ${ORGANIZATION} },
  }
`;

export const RESEARCH_QUERY = groq`
  *[
    _type == "research" &&
    slug.current == $slug
  ] [0] {
    ${RESEARCH}
    organization -> { ${ORGANIZATION} },
  }
`;
