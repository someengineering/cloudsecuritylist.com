import { MARKET_SEGMENT_BASE } from '@/lib/sanity/queries/fragments/marketSegment';
import { groq } from 'next-sanity';

// @sanity-typegen-ignore
export const PRODUCT_CATEGORY = groq`
  _id,
  "slug": slug.current,
  name,
  expansion,
  description,
  marketSegment -> { ${MARKET_SEGMENT_BASE} },
`;
