import { MARKET_SEGMENT } from '@/lib/sanity/queries/fragments/marketSegment';
import { groq } from 'next-sanity';

export const MARKET_SEGMENTS_QUERY = groq`
  *[
    _type == "marketSegment"
  ] | order(lower(name) asc) {
    ${MARKET_SEGMENT}
  }
`;

export const MARKET_SEGMENT_QUERY = groq`
  *[
    _type == "marketSegment" &&
    slug.current == $slug
  ][0] {
    ${MARKET_SEGMENT}
  }
`;
