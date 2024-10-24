import { Filters, FiltersProvider } from '@/components/content/Vendors/Context';
import FilterPanel from '@/components/content/Vendors/FilterPanel';
import List from '@/components/content/Vendors/List';
import {
  getCloudProviders,
  getProductCategories,
  getVendorOrganizationTypes,
  getVendors,
} from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';

export default async function Vendors({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const productCategoriesData = getProductCategories({
    referenceType: 'organization',
  });
  const organizationTypesData = getVendorOrganizationTypes();
  const cloudProvidersData = getCloudProviders();
  const vendorsData = getVendors(filters ?? {});

  const [productCategories, organizationTypes, cloudProviders, vendors] =
    await Promise.all([
      productCategoriesData,
      organizationTypesData,
      cloudProvidersData,
      vendorsData,
    ]);

  return (
    <section className="pb-12 sm:pb-16">
      <FiltersProvider
        initialValues={{
          ...filters,
          productCategories: filters?.productCategories?.filter((slug) =>
            productCategories.some((category) => category.slug === slug),
          ),
          organizationTypes: filters?.organizationTypes?.filter(
            (type) => type in ORGANIZATION_TYPE,
          ),
          supportedCloudProviders: filters?.supportedCloudProviders?.filter(
            (slug) => cloudProviders.some((provider) => provider.slug === slug),
          ),
        }}
      >
        <FilterPanel
          productCategories={productCategories}
          organizationTypes={organizationTypes}
          cloudProviders={cloudProviders}
        />
        <List
          initialData={vendors}
          getVendors={async (
            activeFilters: Partial<Filters>,
            prev?: string,
          ) => {
            'use server';

            if (typeof prev === 'string') {
              return await getVendors({ ...activeFilters, prev });
            }

            return [];
          }}
        />
      </FiltersProvider>
    </section>
  );
}
