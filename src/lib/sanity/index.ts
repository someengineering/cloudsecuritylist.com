import 'server-only';

import { sanityFetch } from '@/lib/sanity/client';
import {
  CLOUD_PROVIDER_QUERY,
  CLOUD_PROVIDER_SLUGS_QUERY,
  CLOUD_PROVIDERS_QUERY,
} from '@/lib/sanity/queries/cloudProvider';
import {
  MARKET_SEGMENT_QUERY,
  MARKET_SEGMENTS_QUERY,
} from '@/lib/sanity/queries/marketSegments';
import {
  ORGANIZATION_QUERY,
  ORGANIZATION_SLUGS_QUERY,
  ORGANIZATIONS_COUNT_QUERY,
  ORGANIZATIONS_QUERY,
  VENDORS_COUNT_QUERY,
  VENDORS_QUERY,
} from '@/lib/sanity/queries/organizations';
import { PAGE_QUERY } from '@/lib/sanity/queries/page';
import {
  PRODUCT_CATEGORIES_QUERY,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_CATEGORY_SLUGS_QUERY,
} from '@/lib/sanity/queries/productCategories';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries/siteSettings';
import {
  ORGANIZATION_TYPE,
  ORGANIZATION_TYPES,
} from '@/lib/sanity/schemas/objects/organizationType';
import {
  CLOUD_PROVIDER_QUERYResult,
  CLOUD_PROVIDER_SLUGS_QUERYResult,
  CLOUD_PROVIDERS_QUERYResult,
  MARKET_SEGMENT_QUERYResult,
  MARKET_SEGMENTS_QUERYResult,
  ORGANIZATION_QUERYResult,
  ORGANIZATION_SLUGS_QUERYResult,
  ORGANIZATIONS_COUNT_QUERYResult,
  ORGANIZATIONS_QUERYResult,
  PAGE_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
  PRODUCT_CATEGORY_QUERYResult,
  PRODUCT_CATEGORY_SLUGS_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  VENDORS_COUNT_QUERYResult,
  VENDORS_QUERYResult,
} from '@/lib/sanity/types';

export const getSiteSettings = async () => {
  const data = await sanityFetch<SITE_SETTINGS_QUERYResult>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });

  return data;
};

export const getPage = async (slug: string) => {
  const data = await sanityFetch<PAGE_QUERYResult>({
    query: PAGE_QUERY,
    params: { slug },
    tags: [`page:${slug}`],
  });

  return data;
};

export const getMarketSegments = async () => {
  const data = await sanityFetch<MARKET_SEGMENTS_QUERYResult>({
    query: MARKET_SEGMENTS_QUERY,
    tags: ['marketSegment'],
  });

  return data;
};

export const getMarketSegment = async (slug: string) => {
  const data = await sanityFetch<MARKET_SEGMENT_QUERYResult>({
    query: MARKET_SEGMENT_QUERY,
    params: { slug },
    tags: [`marketSegment:${slug}`],
  });

  return data;
};

export const getProductCategorySlugs = async () => {
  const data = await sanityFetch<PRODUCT_CATEGORY_SLUGS_QUERYResult>({
    query: PRODUCT_CATEGORY_SLUGS_QUERY,
    tags: ['productCategory'],
    respectDraftMode: false,
  });

  return data;
};

export const getProductCategories = async (marketSegment?: string) => {
  const data = await sanityFetch<PRODUCT_CATEGORIES_QUERYResult>({
    query: PRODUCT_CATEGORIES_QUERY,
    params: { marketSegment: marketSegment ?? '' },
    tags: [
      marketSegment ? `marketSegment:${marketSegment}` : 'productCategory',
    ],
  });

  return data;
};

export const getProductCategory = async (slug: string) => {
  const data = await sanityFetch<PRODUCT_CATEGORY_QUERYResult>({
    query: PRODUCT_CATEGORY_QUERY,
    params: { slug },
    tags: [`productCategory:${slug}`],
  });

  return data;
};

export const getCloudProviderSlugs = async () => {
  const data = await sanityFetch<CLOUD_PROVIDER_SLUGS_QUERYResult>({
    query: CLOUD_PROVIDER_SLUGS_QUERY,
    tags: ['cloudProvider'],
    respectDraftMode: false,
  });

  return data;
};

export const getCloudProviders = async () => {
  const data = await sanityFetch<CLOUD_PROVIDERS_QUERYResult>({
    query: CLOUD_PROVIDERS_QUERY,
    tags: ['cloudProvider'],
  });

  return data;
};

export const getCloudProvider = async (slug: string) => {
  const data = await sanityFetch<CLOUD_PROVIDER_QUERYResult>({
    query: CLOUD_PROVIDER_QUERY,
    params: { slug },
    tags: [`cloudProvider:${slug}`],
  });

  return data;
};

export const getOrganizationTypes = async () => {
  const data = (
    await Promise.all(
      ORGANIZATION_TYPES.map(async (type) => {
        const count = await sanityFetch<ORGANIZATIONS_COUNT_QUERYResult>({
          query: ORGANIZATIONS_COUNT_QUERY,
          params: {
            organizationTypes: [type.value],
          },
          tags: ['organization'],
        });

        return { value: type.value, count };
      }),
    )
  )
    .filter((type) => type.count > 0)
    .map((type) => type.value);

  return data;
};

export const getOrganizationSlugs = async () => {
  const data = await sanityFetch<ORGANIZATION_SLUGS_QUERYResult>({
    query: ORGANIZATION_SLUGS_QUERY,
    tags: ['organization'],
    respectDraftMode: false,
  });

  return data;
};

export const getOrganizations = async ({
  organizationTypes,
  prev,
}: {
  organizationTypes?: ORGANIZATION_TYPE[];
  prev?: string;
}) => {
  const data = await sanityFetch<ORGANIZATIONS_QUERYResult>({
    query: ORGANIZATIONS_QUERY,
    params: {
      organizationTypes: organizationTypes ?? [],
      prev: prev ?? '',
    },
    tags:
      (organizationTypes ?? []).length > 0
        ? ['organization']
        : (organizationTypes ?? []).map((slug) => `organizationType:${slug}`),
  });

  return data;
};

export const getOrganization = async (slug: string) => {
  const data = await sanityFetch<ORGANIZATION_QUERYResult>({
    query: ORGANIZATION_QUERY,
    params: { slug },
    tags: [`organization:${slug}`],
  });

  return data;
};

export const getVendorTypes = async () => {
  const data = (
    await Promise.all(
      ORGANIZATION_TYPES.map(async (type) => {
        const count = await sanityFetch<VENDORS_COUNT_QUERYResult>({
          query: VENDORS_COUNT_QUERY,
          params: {
            productCategories: [],
            organizationTypes: [type.value],
          },
          tags: ['organization'],
        });

        return { value: type.value, count };
      }),
    )
  )
    .filter((type) => type.count > 0)
    .map((type) => type.value);

  return data;
};

export const getVendors = async ({
  productCategories,
  organizationTypes,
  prev,
}: {
  productCategories?: string[];
  organizationTypes?: ORGANIZATION_TYPE[];
  prev?: string;
}) => {
  const data = await sanityFetch<VENDORS_QUERYResult>({
    query: VENDORS_QUERY,
    params: {
      productCategories: await Promise.all(
        (productCategories ?? []).map(
          async (slug) => (await getProductCategory(slug))?._id,
        ),
      ),
      organizationTypes: organizationTypes ?? [],
      prev: prev ?? '',
    },
    tags:
      (productCategories ?? []).length + (organizationTypes ?? []).length > 0
        ? ['organization']
        : [
            ...(productCategories ?? []).map(
              (slug) => `productCategory:${slug}`,
            ),
            ...(organizationTypes ?? []).map(
              (slug) => `organizationType:${slug}`,
            ),
          ],
  });

  return data;
};
