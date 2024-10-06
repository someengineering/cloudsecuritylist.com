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
import { isValidSlug } from '@/utils/slug';
import { redirect } from 'next/navigation';

export default async function ProductCategories({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegmentsData = getMarketSegments();
  const productCategoriesData = getProductCategories(
    filters.marketSegment && isValidSlug(filters.marketSegment)
      ? (await getMarketSegment(filters.marketSegment))?._id
      : undefined,
  );

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

            const marketSegment =
              activeFilters.marketSegment &&
              isValidSlug(activeFilters.marketSegment)
                ? (await getMarketSegment(activeFilters.marketSegment))?._id
                : undefined;

            return await getProductCategories(marketSegment);
          }}
        />
      </FiltersProvider>
    </section>
  );
}
