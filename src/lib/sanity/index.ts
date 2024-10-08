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
} from '@/lib/sanity/queries/marketSegment';
import {
  OPEN_SOURCE_PROJECTS_QUERY,
  UNPAGINATED_OPEN_SOURCE_PROJECTS_QUERY,
} from '@/lib/sanity/queries/openSourceProject';
import {
  ACQUISITIONS_QUERY,
  ORGANIZATION_QUERY,
  ORGANIZATION_SLUGS_QUERY,
  UNPAGINATED_ACQUISITIONS_QUERY,
  UNPAGINATED_VENDORS_QUERY,
  VENDORS_COUNT_QUERY,
  VENDORS_QUERY,
} from '@/lib/sanity/queries/organization';
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from '@/lib/sanity/queries/page';
import {
  PRODUCT_CATEGORIES_QUERY,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_CATEGORY_SLUGS_QUERY,
} from '@/lib/sanity/queries/productCategory';
import {
  RESEARCH_QUERY,
  RESEARCHES_QUERY,
} from '@/lib/sanity/queries/research';
import { SITEMAP_QUERY } from '@/lib/sanity/queries/sitemap';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries/siteSettings';
import {
  ORGANIZATION_TYPE,
  ORGANIZATION_TYPES,
} from '@/lib/sanity/schemas/objects/organizationType';
import {
  ACQUISITIONS_QUERYResult,
  CLOUD_PROVIDER_QUERYResult,
  CLOUD_PROVIDER_SLUGS_QUERYResult,
  CLOUD_PROVIDERS_QUERYResult,
  MARKET_SEGMENT_QUERYResult,
  MARKET_SEGMENTS_QUERYResult,
  OPEN_SOURCE_PROJECTS_QUERYResult,
  ORGANIZATION_QUERYResult,
  ORGANIZATION_SLUGS_QUERYResult,
  PAGE_QUERYResult,
  PAGE_SLUGS_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
  PRODUCT_CATEGORY_QUERYResult,
  PRODUCT_CATEGORY_SLUGS_QUERYResult,
  RESEARCH_QUERYResult,
  RESEARCHES_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  SITEMAP_QUERYResult,
  VENDORS_COUNT_QUERYResult,
  VENDORS_QUERYResult,
} from '@/lib/sanity/types';

export const getSitemap = async () => {
  const data = await sanityFetch<SITEMAP_QUERYResult>({
    query: SITEMAP_QUERY,
    tags: ['sitemap'],
    allowDraftMode: false,
  });

  return data;
};

export const getSiteSettings = async () => {
  const data = await sanityFetch<SITE_SETTINGS_QUERYResult>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });

  return data;
};

export const getPageSlugs = async () => {
  const data = await sanityFetch<PAGE_SLUGS_QUERYResult>({
    query: PAGE_SLUGS_QUERY,
    tags: ['page'],
    allowDraftMode: false,
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
    allowDraftMode: false,
  });

  return data;
};

export const getProductCategories = async ({
  marketSegment,
  referenceType,
}: {
  marketSegment?: string;
  referenceType?: 'organization' | 'openSourceProject';
}) => {
  const marketSegmentId = marketSegment
    ? (await getMarketSegment(marketSegment))?._id
    : undefined;

  const data = await sanityFetch<PRODUCT_CATEGORIES_QUERYResult>({
    query: PRODUCT_CATEGORIES_QUERY,
    params: {
      marketSegment: marketSegmentId ?? '',
      referenceType: referenceType ?? '',
    },
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
    allowDraftMode: false,
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

export const getOrganizationSlugs = async () => {
  const data = await sanityFetch<ORGANIZATION_SLUGS_QUERYResult>({
    query: ORGANIZATION_SLUGS_QUERY,
    tags: ['organization'],
    allowDraftMode: false,
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
      ORGANIZATION_TYPES.filter(
        (type) => type.value !== ORGANIZATION_TYPE.ACQUIRED,
      ).map(async (type) => {
        const count = await sanityFetch<VENDORS_COUNT_QUERYResult>({
          query: VENDORS_COUNT_QUERY,
          params: {
            productCategories: [],
            organizationTypes: [type.value],
            supportedCloudProviders: [],
          },
          tags: [`organizationType:${type.value}`],
        });

        return { value: type.value, count };
      }),
    )
  )
    .filter((type) => type.count)
    .map((type) => type.value);

  return data;
};

export const getVendors = async ({
  productCategories,
  organizationTypes,
  supportedCloudProviders,
  searchQuery,
  prev,
  paginated = true,
}: {
  productCategories?: string[];
  organizationTypes?: ORGANIZATION_TYPE[];
  supportedCloudProviders?: string[];
  searchQuery?: string;
  prev?: string;
  paginated?: boolean;
}) => {
  const data = await sanityFetch<VENDORS_QUERYResult>({
    query: paginated ? VENDORS_QUERY : UNPAGINATED_VENDORS_QUERY,
    params: {
      productCategories: (
        await Promise.all(
          (productCategories ?? []).map(
            async (slug) => (await getProductCategory(slug))?._id,
          ),
        )
      ).filter(Boolean) as string[],
      organizationTypes: organizationTypes ?? [],
      supportedCloudProviders: (
        await Promise.all(
          (supportedCloudProviders ?? []).map(
            async (slug) => (await getCloudProvider(slug))?._id,
          ),
        )
      ).filter(Boolean) as string[],
      searchQuery: searchQuery ?? '',
      ...(paginated ? { prev: prev ?? '' } : null),
    },
    tags:
      productCategories?.length ||
      organizationTypes?.length ||
      supportedCloudProviders?.length
        ? [
            ...(productCategories ?? []).map(
              (slug) => `productCategory:${slug}`,
            ),
            ...(organizationTypes ?? []).map(
              (slug) => `organizationType:${slug}`,
            ),
            ...(supportedCloudProviders ?? []).map(
              (slug) => `cloudProvider:${slug}`,
            ),
          ]
        : ['organization'],
  });

  return data;
};

export const getOpenSourceProjects = async ({
  productCategories,
  supportedCloudProviders,
  searchQuery,
  prev,
  paginated = true,
}: {
  productCategories?: string[];
  supportedCloudProviders?: string[];
  searchQuery?: string;
  prev?: string;
  paginated?: boolean;
}) => {
  const data = await sanityFetch<OPEN_SOURCE_PROJECTS_QUERYResult>({
    query: paginated
      ? OPEN_SOURCE_PROJECTS_QUERY
      : UNPAGINATED_OPEN_SOURCE_PROJECTS_QUERY,
    params: {
      productCategories: (
        await Promise.all(
          (productCategories ?? []).map(
            async (slug) => (await getProductCategory(slug))?._id,
          ),
        )
      ).filter(Boolean) as string[],
      supportedCloudProviders: (
        await Promise.all(
          (supportedCloudProviders ?? []).map(
            async (slug) => (await getCloudProvider(slug))?._id,
          ),
        )
      ).filter(Boolean) as string[],
      searchQuery: searchQuery ?? '',
      ...(paginated ? { prev: prev ?? '' } : null),
    },
    tags:
      productCategories?.length || supportedCloudProviders?.length
        ? [
            ...(productCategories ?? []).map(
              (slug) => `productCategory:${slug}`,
            ),
            ...(supportedCloudProviders ?? []).map(
              (slug) => `cloudProvider:${slug}`,
            ),
          ]
        : ['openSourceProject'],
  });

  return data;
};

export const getAcquisitions = async ({
  paginated = true,
  prevDate,
  prevId,
}: {
  paginated?: boolean;
  prevDate?: string;
  prevId?: string;
}) => {
  const data = await sanityFetch<ACQUISITIONS_QUERYResult>({
    query: paginated ? ACQUISITIONS_QUERY : UNPAGINATED_ACQUISITIONS_QUERY,
    params: {
      prevDate: prevDate ?? '',
      prevId: prevId ?? '',
    },
    tags: [`organizationType:${ORGANIZATION_TYPE.ACQUIRED}`],
  });

  return data;
};

export const getResearches = async () => {
  const data = await sanityFetch<RESEARCHES_QUERYResult>({
    query: RESEARCHES_QUERY,
    tags: ['research'],
  });

  return data;
};

export const getResearch = async (slug: string) => {
  const data = await sanityFetch<RESEARCH_QUERYResult>({
    query: RESEARCH_QUERY,
    params: { slug },
    tags: [`research:${slug}`],
  });

  return data;
};
