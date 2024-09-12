export const MARKET_SEGMENT_BASE = `
  _id,
  name,
  "slug": slug.current,
  description,
  "icon": icon.name,
`;

export const MARKET_SEGMENT = `
  ${MARKET_SEGMENT_BASE}
  "productCategories": *[_type == "productCategory" && marketSegment._ref == ^._id && count(*[_type == "organization" && references(^._id)]) > 0] | order(lower(name) asc) {
    _id,
    name,
    "slug": slug.current,
    expansion,
  },
`;
