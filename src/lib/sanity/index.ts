import 'server-only';

import { sanityFetch } from '@/lib/sanity/client';
import {
  MARKET_SEGMENT_QUERY,
  MARKET_SEGMENTS_QUERY,
} from '@/lib/sanity/queries/marketSegments';
import {
  VENDOR_QUERY,
  VENDORS_COUNT_QUERY,
  VENDORS_QUERY,
} from '@/lib/sanity/queries/organizations';
import { PAGE_QUERY } from '@/lib/sanity/queries/page';
import {
  PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERY,
  PRODUCT_CATEGORIES_QUERY,
  PRODUCT_CATEGORY_QUERY,
} from '@/lib/sanity/queries/productCategories';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries/siteSettings';
import {
  ORGANIZATION_TYPE,
  ORGANIZATION_TYPES,
} from '@/lib/sanity/schemas/objects/organizationType';
import {
  MARKET_SEGMENT_QUERYResult,
  MARKET_SEGMENTS_QUERYResult,
  PAGE_QUERYResult,
  PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
  PRODUCT_CATEGORY_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  VENDOR_QUERYResult,
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
    tags: [`page-${slug}`],
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
    tags: [`marketSegment-${slug}`],
  });

  return data;
};

export const getProductCategories = async (marketSegment?: string) => {
  const data = marketSegment
    ? await sanityFetch<PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERYResult>({
        query: PRODUCT_CATEGORIES_BY_MARKET_SEGMENT_QUERY,
        params: { marketSegment },
        tags: [`marketSegment-${marketSegment}`, 'productCategory'],
      })
    : await sanityFetch<PRODUCT_CATEGORIES_QUERYResult>({
        query: PRODUCT_CATEGORIES_QUERY,
        tags: ['marketSegment', 'productCategory'],
      });

  return data;
};

export const getProductCategory = async (slug: string) => {
  const data = await sanityFetch<PRODUCT_CATEGORY_QUERYResult>({
    query: PRODUCT_CATEGORY_QUERY,
    params: { slug },
    tags: [`productCategory-${slug}`],
  });

  return data;
};

export const getOrganizationTypes = async () => {
  const data = (
    await Promise.all(
      ORGANIZATION_TYPES.map(async (type) => {
        const vendorsCount = await sanityFetch<VENDORS_COUNT_QUERYResult>({
          query: VENDORS_COUNT_QUERY,
          params: {
            productCategories: [],
            organizationTypes: [type.value],
          },
          tags: ['vendor'],
        });

        return { value: type.value, vendorsCount };
      }),
    )
  )
    .filter((type) => type.vendorsCount > 0)
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
      productCategories: productCategories ?? [],
      organizationTypes: organizationTypes ?? [],
      prev: prev ?? '',
    },
    tags: [
      'vendor',
      ...(productCategories ?? []).map((slug) => `productCategory-${slug}`),
    ],
  });

  return data;
};

export const getVendor = async (slug: string) => {
  const data = await sanityFetch<VENDOR_QUERYResult>({
    query: VENDOR_QUERY,
    params: { slug },
    tags: [`vendor-${slug}`],
  });

  return data;
};
