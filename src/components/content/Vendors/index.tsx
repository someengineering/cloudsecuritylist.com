import { Filters, FiltersProvider } from '@/components/content/Vendors/Context';
import FilterPanel from '@/components/content/Vendors/FilterPanel';
import List from '@/components/content/Vendors/List';
import {
  getCloudProviders,
  getMarketSegments,
  getProductCategories,
  getVendors,
  getVendorTypes,
} from '@/lib/sanity';

export default async function Vendors({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegmentsData = getMarketSegments();
  const productCategoriesData = getProductCategories();
  const organizationTypesData = getVendorTypes();
  const cloudProvidersData = getCloudProviders();
  const vendorsData = getVendors(filters ?? {});

  const [
    marketSegments,
    productCategories,
    organizationTypes,
    cloudProviders,
    vendors,
  ] = await Promise.all([
    marketSegmentsData,
    productCategoriesData,
    organizationTypesData,
    cloudProvidersData,
    vendorsData,
  ]);

  return (
    <FiltersProvider initialValues={filters}>
      {marketSegments.length > 0 && productCategories.length > 0 ? (
        <FilterPanel
          marketSegments={marketSegments}
          productCategories={productCategories}
          organizationTypes={organizationTypes}
          cloudProviders={cloudProviders}
        />
      ) : null}
      <List
        initialData={vendors}
        getVendors={async (activeFilters: Partial<Filters>, prev?: string) => {
          'use server';

          return await getVendors({ ...activeFilters, prev });
        }}
      />
    </FiltersProvider>
  );
}
