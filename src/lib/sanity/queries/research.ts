import { ORGANIZATION } from '@/lib/sanity/queries/fragments/organization';
import { RESEARCH } from '@/lib/sanity/queries/fragments/research';
import { groq } from 'next-sanity';

export const RESEARCHES_QUERY = groq`
  *[
    _type == "research" &&
    (!defined($productCategories) || count($productCategories) == 0 || references($productCategories))
  ] | order(lower(name) asc) [0...20] {
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
