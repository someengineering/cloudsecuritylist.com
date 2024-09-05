import { PRODUCT_CATEGORY } from '@/lib/sanity/queries/fragments/productCategory';
import { RESEARCH } from '@/lib/sanity/queries/fragments/research';

export const ORGANIZATION = `
  _id,
  name,
  "slug": slug.current,
  organizationType,
  stockSymbol,
  logo,
  icon,
  productCategories[] -> { ${PRODUCT_CATEGORY} },
  "research": *[_type == "research" && organization._ref == ^._id] {
    ${RESEARCH}
  },
  website,
  linkedin,
  crunchbase,
  description,
`;
