import {
  Filters,
  FiltersProvider,
} from '@/components/content/ProductCategories/Context';
import FilterButtons from '@/components/content/ProductCategories/FilterButtons';
import List from '@/components/content/ProductCategories/List';
import { getMarketSegments, getProductCategories } from '@/lib/sanity';
import { redirect } from 'next/navigation';

export default async function ProductCategories({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegmentsData = getMarketSegments();
  const productCategoriesData = getProductCategories({
    marketSegment: filters.marketSegment,
  });

  const [marketSegments, productCategories] = await Promise.all([
    marketSegmentsData,
    productCategoriesData,
  ]);

  if (!productCategories.length) {
    redirect('/categories');
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 sm:pb-16 lg:px-8">
      <FiltersProvider initialValues={filters}>
        {marketSegments.length ? (
          <FilterButtons marketSegments={marketSegments} />
        ) : null}
        <List
          initialData={productCategories}
          getProductCategories={async (activeFilters: Filters) => {
            'use server';

            return await getProductCategories({
              marketSegment: activeFilters.marketSegment,
            });
          }}
        />
      </FiltersProvider>
    </section>
  );
}
