import { Filters, FiltersProvider } from '@/components/content/Vendors/Context';
import FilterPanel from '@/components/content/Vendors/FilterPanel';
import List from '@/components/content/Vendors/List';
import {
  getMarketSegments,
  getOrganizationTypes,
  getProductCategories,
  getVendors,
} from '@/lib/sanity';

export default async function Vendors({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegmentsData = getMarketSegments();
  const productCategoriesData = getProductCategories();
  const organizationTypesData = getOrganizationTypes();

  const [marketSegments, productCategories, organizationTypes] =
    await Promise.all([
      marketSegmentsData,
      productCategoriesData,
      organizationTypesData,
    ]);

  return (
    <FiltersProvider initialValues={filters}>
      {marketSegments.length > 0 && productCategories.length > 0 ? (
        <FilterPanel
          marketSegments={marketSegments}
          productCategories={productCategories}
          organizationTypes={organizationTypes}
        />
      ) : null}
      <List
        initialData={await getVendors(filters ?? {})}
        getVendors={async (
          activeFilters: Partial<Filters>,
          lastItem?: string,
        ) => {
          'use server';

          return await getVendors({ ...activeFilters, prev: lastItem });
        }}
      />
    </FiltersProvider>
  );
}
