import { MARKET_SEGMENT_BASE } from '@/lib/sanity/queries/fragments/marketSegment';

export const PRODUCT_CATEGORY = `
  _id,
  "slug": slug.current,
  name,
  expansion,
  description,
  marketSegment -> { ${MARKET_SEGMENT_BASE} },
`;
