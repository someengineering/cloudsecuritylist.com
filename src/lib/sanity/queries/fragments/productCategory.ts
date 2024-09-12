import { MARKET_SEGMENT_BASE } from '@/lib/sanity/queries/fragments/marketSegment';

export const PRODUCT_CATEGORY = `
  _id,
  name,
  "slug": slug.current,
  expansion,
  description,
  marketSegment -> { ${MARKET_SEGMENT_BASE} },
`;
