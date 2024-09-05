import { MARKET_SEGMENT } from '@/lib/sanity/queries/fragments/marketSegment';

export const PRODUCT_CATEGORY = `
  _id,
  name,
  "slug": slug.current,
  expansion,
  marketSegment -> { ${MARKET_SEGMENT} },
  description,
`;
