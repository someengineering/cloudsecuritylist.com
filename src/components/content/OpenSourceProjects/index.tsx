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
  paginated = true,
}: {
  filters: Partial<Filters>;
  paginated?: boolean;
}) {
  const productCategoriesData = getProductCategories({
    referenceType: 'openSourceProject',
  });
  const cloudProvidersData = getCloudProviders();
  const openSourceProjectsData = getOpenSourceProjects({
    ...filters,
    paginated,
  });

  const [productCategories, cloudProviders, openSourceProjects] =
    await Promise.all([
      productCategoriesData,
      cloudProvidersData,
      openSourceProjectsData,
    ]);

  return (
    <section className="group pb-12 sm:pb-16">
      <FiltersProvider
        initialValues={{
          ...filters,
          productCategories: filters?.productCategories?.filter((slug) =>
            productCategories.some((category) => category.slug === slug),
          ),
          supportedCloudProviders: filters?.supportedCloudProviders?.filter(
            (slug) => cloudProviders.some((provider) => provider.slug === slug),
          ),
        }}
      >
        <FilterPanel
          productCategories={productCategories}
          cloudProviders={cloudProviders}
        />
        <List
          initialData={openSourceProjects}
          fetchMore={async (prev: string) => {
            'use server';

            if (paginated && typeof prev === 'string') {
              return await getOpenSourceProjects({ ...filters, prev });
            }

            return [];
          }}
          paginated={paginated}
        />
      </FiltersProvider>
    </section>
  );
}
