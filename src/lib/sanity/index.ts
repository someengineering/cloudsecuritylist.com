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
  OPEN_SOURCE_PROJECT_QUERY,
  OPEN_SOURCE_PROJECT_SLUGS_QUERY,
  OPEN_SOURCE_PROJECTS_QUERY,
  UNPAGINATED_OPEN_SOURCE_PROJECTS_QUERY,
} from '@/lib/sanity/queries/openSourceProject';
import {
  ACQUISITIONS_QUERY,
  ORGANIZATION_QUERY,
  ORGANIZATION_SLUGS_QUERY,
  UNPAGINATED_ACQUISITIONS_QUERY,
  UNPAGINATED_VENDORS_QUERY,
  VENDORS_QUERY,
} from '@/lib/sanity/queries/organization';
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from '@/lib/sanity/queries/page';
import {
  PRODUCT_CATEGORIES_QUERY,
  PRODUCT_CATEGORY_QUERY,
  PRODUCT_CATEGORY_SLUGS_QUERY,
} from '@/lib/sanity/queries/productCategory';
import { REDIRECT_QUERY } from '@/lib/sanity/queries/redirect';
import {
  RESEARCH_QUERY,
  RESEARCHES_QUERY,
} from '@/lib/sanity/queries/research';
import {
  SITEMAP_QUERY,
  UPDATED_URLS_QUERY,
} from '@/lib/sanity/queries/sitemap';
import {
  SITE_SETTINGS_QUERY,
  SITE_URL_QUERY,
} from '@/lib/sanity/queries/siteSettings';
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
  OPEN_SOURCE_PROJECT_QUERYResult,
  OPEN_SOURCE_PROJECT_SLUGS_QUERYResult,
  OPEN_SOURCE_PROJECTS_QUERYResult,
  ORGANIZATION_QUERYResult,
  ORGANIZATION_SLUGS_QUERYResult,
  PAGE_QUERYResult,
  PAGE_SLUGS_QUERYResult,
  PRODUCT_CATEGORIES_QUERYResult,
  PRODUCT_CATEGORY_QUERYResult,
  PRODUCT_CATEGORY_SLUGS_QUERYResult,
  REDIRECT_QUERYResult,
  RESEARCH_QUERYResult,
  RESEARCHES_QUERYResult,
  SITE_SETTINGS_QUERYResult,
  SITE_URL_QUERYResult,
  SITEMAP_QUERYResult,
  UPDATED_URLS_QUERYResult,
  VENDORS_QUERYResult,
} from '@/lib/sanity/types';
import { groq } from 'next-sanity';

export const getSitemap = async () =>
  await sanityFetch<SITEMAP_QUERYResult>({
    query: SITEMAP_QUERY,
    tags: ['sitemap'],
    allowDraftMode: false,
  });

export const getUpdatedUrls = async (): Promise<string[]> =>
  (await sanityFetch<UPDATED_URLS_QUERYResult>({
    query: UPDATED_URLS_QUERY,
    tags: ['sitemap'],
    allowDraftMode: false,
  })) ?? [];

export const getRedirect = async (type: string, slug: string) =>
  await sanityFetch<REDIRECT_QUERYResult>({
    query: REDIRECT_QUERY,
    params: { type, slug },
    tags: [`${type}:${slug}`],
    allowDraftMode: false,
  });

export const getSiteUrl = async () =>
  await sanityFetch<SITE_URL_QUERYResult>({
    query: SITE_URL_QUERY,
    tags: ['siteSettings'],
    allowDraftMode: false,
  });

export const getSiteSettings = async () =>
  await sanityFetch<SITE_SETTINGS_QUERYResult>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });

export const getPageSlugs = async () =>
  await sanityFetch<PAGE_SLUGS_QUERYResult>({
    query: PAGE_SLUGS_QUERY,
    tags: ['page'],
    allowDraftMode: false,
  });

export const getPage = async (slug: string) =>
  await sanityFetch<PAGE_QUERYResult>({
    query: PAGE_QUERY,
    params: { slug },
    tags: [`page:${slug}`],
  });

export const getMarketSegments = async () =>
  await sanityFetch<MARKET_SEGMENTS_QUERYResult>({
    query: MARKET_SEGMENTS_QUERY,
    tags: ['marketSegment'],
  });

export const getMarketSegment = async (slug: string) =>
  await sanityFetch<MARKET_SEGMENT_QUERYResult>({
    query: MARKET_SEGMENT_QUERY,
    params: { slug },
    tags: [`marketSegment:${slug}`],
  });

export const getProductCategorySlugs = async () =>
  await sanityFetch<PRODUCT_CATEGORY_SLUGS_QUERYResult>({
    query: PRODUCT_CATEGORY_SLUGS_QUERY,
    tags: ['productCategory'],
    allowDraftMode: false,
  });

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

export const getProductCategory = async (slug: string) =>
  await sanityFetch<PRODUCT_CATEGORY_QUERYResult>({
    query: PRODUCT_CATEGORY_QUERY,
    params: { slug },
    tags: [`productCategory:${slug}`],
  });

export const getCloudProviderSlugs = async () =>
  await sanityFetch<CLOUD_PROVIDER_SLUGS_QUERYResult>({
    query: CLOUD_PROVIDER_SLUGS_QUERY,
    tags: ['cloudProvider'],
    allowDraftMode: false,
  });

export const getCloudProviders = async () =>
  await sanityFetch<CLOUD_PROVIDERS_QUERYResult>({
    query: CLOUD_PROVIDERS_QUERY,
    tags: ['cloudProvider'],
  });

export const getCloudProvider = async (slug: string) =>
  await sanityFetch<CLOUD_PROVIDER_QUERYResult>({
    query: CLOUD_PROVIDER_QUERY,
    params: { slug },
    tags: [`cloudProvider:${slug}`],
  });

export const getOrganizationSlugs = async () =>
  await sanityFetch<ORGANIZATION_SLUGS_QUERYResult>({
    query: ORGANIZATION_SLUGS_QUERY,
    tags: ['organization'],
    allowDraftMode: false,
  });

export const getOrganization = async (slug: string) =>
  await sanityFetch<ORGANIZATION_QUERYResult>({
    query: ORGANIZATION_QUERY,
    params: { slug },
    tags: [`organization:${slug}`],
  });

export const getVendorTypes = async () =>
  await Promise.all(
    ORGANIZATION_TYPES.map((type) => type.value).filter(
      async (type) =>
        type !== ORGANIZATION_TYPE.ACQUIRED &&
        (await sanityFetch<boolean>({
          query: groq`defined(*[_type == "organization" && organizationType != "acquired" && organizationType == $organizationType][0])`,
          params: {
            organizationType: type,
          },
          tags: [`organizationType:${type}`],
        })),
    ),
  );

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
}) =>
  await sanityFetch<VENDORS_QUERYResult>({
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

export const getOpenSourceProjectSlugs = async () =>
  await sanityFetch<OPEN_SOURCE_PROJECT_SLUGS_QUERYResult>({
    query: OPEN_SOURCE_PROJECT_SLUGS_QUERY,
    tags: ['openSourceProject'],
    allowDraftMode: false,
  });

export const getOpenSourceProject = async (slug: string) =>
  await sanityFetch<OPEN_SOURCE_PROJECT_QUERYResult>({
    query: OPEN_SOURCE_PROJECT_QUERY,
    params: { slug },
    tags: [`openSourceProject:${slug}`],
  });

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
}) =>
  await sanityFetch<OPEN_SOURCE_PROJECTS_QUERYResult>({
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

export const getAcquisitions = async ({
  paginated = true,
  prevDate,
  prevId,
}: {
  paginated?: boolean;
  prevDate?: string;
  prevId?: string;
}) =>
  await sanityFetch<ACQUISITIONS_QUERYResult>({
    query: paginated ? ACQUISITIONS_QUERY : UNPAGINATED_ACQUISITIONS_QUERY,
    params: {
      prevDate: prevDate ?? '',
      prevId: prevId ?? '',
    },
    tags: [`organizationType:${ORGANIZATION_TYPE.ACQUIRED}`],
  });

export const getResearches = async () =>
  await sanityFetch<RESEARCHES_QUERYResult>({
    query: RESEARCHES_QUERY,
    tags: ['research'],
  });

export const getResearch = async (slug: string) =>
  await sanityFetch<RESEARCH_QUERYResult>({
    query: RESEARCH_QUERY,
    params: { slug },
    tags: [`research:${slug}`],
  });
