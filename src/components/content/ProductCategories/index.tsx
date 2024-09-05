import {
  Filters,
  FiltersProvider,
} from '@/components/content/ProductCategories/Context';
import FilterButtons from '@/components/content/ProductCategories/FilterButtons';
import List from '@/components/content/ProductCategories/List';
import { sanityFetch } from '@/lib/sanity/client';
import {
  MARKET_SEGMENT_QUERY,
  MARKET_SEGMENTS_QUERY,
} from '@/lib/sanity/queries/marketSegments';
import {
  PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERY,
  PRODUCT_CATEGORIES_QUERY,
} from '@/lib/sanity/queries/productCategories';
import {
  MARKET_SEGMENT_QUERYResult,
  MARKET_SEGMENTS_QUERYResult,
  PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
} from '@/lib/sanity/types';

export default async function ProductCategories({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegments = await sanityFetch<MARKET_SEGMENTS_QUERYResult>({
    query: MARKET_SEGMENTS_QUERY,
    tags: ['marketSegment'],
  });

  return (
    <FiltersProvider initialValues={filters}>
      {marketSegments.length > 0 ? (
        <FilterButtons marketSegments={marketSegments} />
      ) : null}
      <List
        getProductCategories={async (activeFilters: Filters) => {
          'use server';

          const marketSegment = activeFilters.marketSegment
            ? (
                await sanityFetch<MARKET_SEGMENT_QUERYResult>({
                  query: MARKET_SEGMENT_QUERY,
                  params: { slug: activeFilters.marketSegment },
                  tags: ['marketSegment'],
                })
              )?._id
            : undefined;

          if (!marketSegment) {
            return await sanityFetch<PRODUCT_CATEGORIES_QUERYResult>({
              query: PRODUCT_CATEGORIES_QUERY,
              tags: ['marketSegment', 'productCategory'],
            });
          }

          return await sanityFetch<PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult>(
            {
              query: PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERY,
              params: {
                marketSegment,
              },
            },
          );
        }}
      />
    </FiltersProvider>
  );
}
