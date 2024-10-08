import {
  Filters,
  FiltersProvider,
} from '@/components/content/OpenSourceProjects/Context';
import FilterPanel from '@/components/content/OpenSourceProjects/FilterPanel';
import List from '@/components/content/OpenSourceProjects/List';
import {
  getCloudProviders,
  getOpenSourceProjects,
  getProductCategories,
} from '@/lib/sanity';

export default async function OpenSourceProjects({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const productCategoriesData = getProductCategories({
    referenceType: 'openSourceProject',
  });
  const cloudProvidersData = getCloudProviders();
  const openSourceProjectsData = getOpenSourceProjects(filters ?? {});

  const [productCategories, cloudProviders, openSourceProjects] =
    await Promise.all([
      productCategoriesData,
      cloudProvidersData,
      openSourceProjectsData,
    ]);

  return (
    <section className="pb-12 sm:pb-16">
      <FiltersProvider initialValues={filters}>
        <FilterPanel
          productCategories={productCategories}
          cloudProviders={cloudProviders}
        />
        <List
          initialData={openSourceProjects}
          getOpenSourceProjects={async (
            activeFilters: Partial<Filters>,
            prev?: string,
          ) => {
            'use server';

            return await getOpenSourceProjects({ ...activeFilters, prev });
          }}
        />
      </FiltersProvider>
    </section>
  );
}
