import { Filters, FiltersProvider } from '@/components/content/Vendors/Context';
import FilterPanel from '@/components/content/Vendors/FilterPanel';
import List from '@/components/content/Vendors/List';
import { sanityFetch } from '@/lib/sanity/client';
import { MARKET_SEGMENTS_QUERY } from '@/lib/sanity/queries/marketSegments';
import {
  VENDORS_COUNT_QUERY,
  VENDORS_QUERY,
} from '@/lib/sanity/queries/organizations';
import {
  PRODUCT_CATEGORIES_QUERY,
  PRODUCT_CATEGORY_QUERY,
} from '@/lib/sanity/queries/productCategories';
import { ORGANIZATION_TYPES } from '@/lib/sanity/schemas/objects/organizationType';
import {
  MARKET_SEGMENTS_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
  PRODUCT_CATEGORY_QUERYResult,
  VENDORS_COUNT_QUERYResult,
  VENDORS_QUERYResult,
} from '@/lib/sanity/types';

export default async function Vendors({
  filters,
}: {
  filters: Partial<Filters>;
}) {
  const marketSegmentsData = sanityFetch<MARKET_SEGMENTS_QUERYResult>({
    query: MARKET_SEGMENTS_QUERY,
    tags: ['marketSegment', 'productCategory'],
  });
  const productCategoriesData = sanityFetch<PRODUCT_CATEGORIES_QUERYResult>({
    query: PRODUCT_CATEGORIES_QUERY,
    tags: ['marketSegment', 'productCategory'],
  });

  const [marketSegments, productCategories] = await Promise.all([
    marketSegmentsData,
    productCategoriesData,
  ]);

  const organizationTypes = (
    await Promise.all(
      ORGANIZATION_TYPES.map(async (type) => {
        const vendorsCount = await sanityFetch<VENDORS_COUNT_QUERYResult>({
          query: VENDORS_COUNT_QUERY,
          params: {
            productCategories: [],
            organizationTypes: [type.value],
          },
        });

        return { value: type.value, vendorsCount };
      }),
    )
  )
    .filter((type) => type.vendorsCount > 0)
    .map((type) => type.value);

  const getVendors = async (
    activeFilters: Partial<Filters>,
    lastItem?: string,
  ) => {
    'use server';

    return await sanityFetch<VENDORS_QUERYResult>({
      query: VENDORS_QUERY,
      params: {
        productCategories: await Promise.all(
          (activeFilters.productCategories ?? []).map(
            async (slug) =>
              (
                await sanityFetch<PRODUCT_CATEGORY_QUERYResult>({
                  query: PRODUCT_CATEGORY_QUERY,
                  params: { slug },
                  tags: ['marketSegment', 'organization', 'productCategory'],
                })
              )?._id,
          ),
        ),
        organizationTypes: activeFilters.organizationTypes ?? [],
        prev: lastItem ?? '',
      },
    });
  };

  return (
    <>
      <div className="px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Cloud security vendors
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Cloud security engineers are notoriously overworked and
            under-resourced. This curated list of tools, frameworks, and
            resources makes their lives easier.
          </p>
        </div>
      </div>
      <FiltersProvider initialValues={filters}>
        {marketSegments.length > 0 && productCategories.length > 0 ? (
          <FilterPanel
            marketSegments={marketSegments}
            productCategories={productCategories}
            organizationTypes={organizationTypes}
          />
        ) : null}
        <List initialData={await getVendors(filters)} getVendors={getVendors} />
      </FiltersProvider>
    </>
  );
}
