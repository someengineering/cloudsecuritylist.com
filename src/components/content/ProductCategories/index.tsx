import {
  Filters,
  FiltersProvider,
} from '@/components/content/ProductCategories/Context';
import FilterPanel from '@/components/content/ProductCategories/FilterPanel';
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
    ...filters,
    referenceType: undefined,
  });

  const [marketSegments, productCategories] = await Promise.all([
    marketSegmentsData,
    productCategoriesData,
  ]);

  if (!productCategories.length && filters.marketSegment) {
    redirect('/categories');
  }

  return (
    <section className="group mx-auto max-w-7xl px-6 pb-12 sm:pb-16 lg:px-8">
      <FiltersProvider initialValues={filters}>
        <FilterPanel marketSegments={marketSegments} />
        <List productCategories={productCategories} />
      </FiltersProvider>
    </section>
  );
}
