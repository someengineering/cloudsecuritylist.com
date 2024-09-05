import { MARKET_SEGMENT } from '@/lib/sanity/queries/fragments/marketSegment';
import { groq } from 'next-sanity';

export const MARKET_SEGMENTS_QUERY = groq`
  *[
    _type == "marketSegment" &&
    defined(slug.current) &&
    count(
      *[
        _type == "productCategory" &&
        marketSegment._ref == ^._id && 
        count(*[_type == "organization" && references(^._id)]) > 0
      ]
    ) > 0
  ] | order(lower(name) asc) [0...20] {
    ${MARKET_SEGMENT}
    "productCategories": *[_type == "productCategory" && marketSegment._ref == ^._id && count(*[_type == "organization" && references(^._id)]) > 0] {
      _id,
      name,
      "slug": slug.current,
      expansion,
    }
  }
`;

export const MARKET_SEGMENT_QUERY = groq`
  *[
    _type == "marketSegment" &&
    slug.current == $slug
  ] [0] {
    ${MARKET_SEGMENT}
    "productCategories": *[_type == "productCategory" && marketSegment._ref == ^._id && count(*[_type == "organization" && references(^._id)]) > 0] {
      _id,
      name,
      "slug": slug.current,
      expansion,
    }
  }
`;
