import {
  Filters,
  FiltersProvider,
} from '@/components/content/ProductCategories/Context';
import FilterButtons from '@/components/content/ProductCategories/FilterButtons';
import List from '@/components/content/ProductCategories/List';
import {
  getMarketSegment,
  getMarketSegments,
  getProductCategories,
} from '@/lib/sanity';

export default async function ProductCategories({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegments = await getMarketSegments();

  return (
    <FiltersProvider initialValues={filters}>
      {marketSegments.length > 0 ? (
        <FilterButtons marketSegments={marketSegments} />
      ) : null}
      <List
        getProductCategories={async (activeFilters: Filters) => {
          'use server';

          const marketSegment = activeFilters.marketSegment
            ? (await getMarketSegment(activeFilters.marketSegment))?._id
            : undefined;

          return await getProductCategories(marketSegment);
        }}
      />
    </FiltersProvider>
  );
}
