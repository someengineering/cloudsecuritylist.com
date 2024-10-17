import { ORGANIZATION_BASE } from '@/lib/sanity/queries/fragments/organization';
import { PUBLICATION } from '@/lib/sanity/queries/fragments/publication';
import { groq } from 'next-sanity';

export const PUBLICATIONS_QUERY = groq`
  *[
    _type == "publication" &&
    (count($publicationTypes) == 0 || publicationType in $publicationTypes)
  ] | order(lower(name) asc) {
    ${PUBLICATION},
    publisher -> { ${ORGANIZATION_BASE} }
  }
`;
