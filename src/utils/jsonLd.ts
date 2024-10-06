import 'server-only';

import { getPage, getSiteSettings } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';
import {
  CLOUD_PROVIDER_QUERYResult,
  ORGANIZATION_QUERYResult,
} from '@/lib/sanity/types';
import { isValidSlug } from '@/utils/slug';
import {
  BreadcrumbList,
  ListItem,
  ProfilePage,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

const getBreadcrumbList = async ({
  siteName,
  siteUrl,
  currentPage,
  parentPageSlug,
}: {
  siteName: string;
  siteUrl: string;
  currentPage: { title: string; path: string };
  parentPageSlug?: string;
}): Promise<BreadcrumbList | undefined> => {
  const itemListElement: ListItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: siteName,
      item: siteUrl,
    },
  ];

  const parentPage =
    parentPageSlug && isValidSlug(parentPageSlug)
      ? await getPage(parentPageSlug)
      : null;

  if (parentPage) {
    itemListElement.push({
      '@type': 'ListItem',
      position: 2,
      name: parentPage.title,
      item: `${siteUrl}/${parentPage.slug}`,
    });
  }

  itemListElement.push({
    '@type': 'ListItem',
    position: itemListElement.length + 1,
    name: currentPage.title,
    item: `${siteUrl}${currentPage.path}`,
  });

  return {
    '@type': 'BreadcrumbList',
    itemListElement,
  };
};

export const getWebPage = async ({
  title,
  path,
  datePublished,
  dateModified,
  parentPageSlug,
}: {
  title: string;
  path: string;
  datePublished?: string;
  dateModified?: string | null;
  parentPageSlug?: string;
}): Promise<
  WithContext<WebSite | WebPage>[] | WithContext<WebPage> | undefined
> => {
  const siteSettings = await getSiteSettings();

  if (!siteSettings) {
    return;
  }

  const url = `${siteSettings.url}${path}`;

  const schema: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    identifier: url,
    url,
    datePublished,
    dateModified: dateModified ?? undefined,
    breadcrumb:
      path !== '/'
        ? await getBreadcrumbList({
            siteName: siteSettings.name,
            siteUrl: siteSettings.url,
            currentPage: {
              title,
              path,
            },
            parentPageSlug,
          })
        : undefined,
    speakable: {
      '@type': 'SpeakableSpecification',
      xpath: [
        "/html/head/meta[@property='og:title']/@content",
        "/html/head/meta[@property='og:description']/@content",
      ],
    },
  };

  if (path === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteSettings.name,
        url: siteSettings.url,
      },
      schema,
    ];
  }

  return schema;
};

export const getOrganizationProfilePage = async (
  organization: ORGANIZATION_QUERYResult,
): Promise<WithContext<ProfilePage> | undefined> => {
  if (!organization) {
    return;
  }

  const webPage = await getWebPage({
    title: organization.name,
    path: `/organization/${organization.slug}`,
    datePublished: organization._createdAt,
    dateModified: organization._updatedAt ?? undefined,
    parentPageSlug:
      'productCategories' in organization &&
      organization.productCategories?.length
        ? 'vendors'
        : undefined,
  });

  const sameAs = [];

  if (organization.linkedin) {
    sameAs.push(organization.linkedin);
  }

  if (organization.crunchbase) {
    sameAs.push(organization.crunchbase);
  }

  const image = [urlFor(organization.mark ?? '').url()];

  if (organization.logo) {
    image.push(urlFor(organization.logo).url());
  }

  return {
    ...webPage,
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Organization',
      name: organization.name,
      identifier: organization._id,
      description: organization.description,
      url: organization.website ?? undefined,
      sameAs,
      image,
    },
  };
};

export const getCloudProviderProfilePage = async (
  cloudProvider: CLOUD_PROVIDER_QUERYResult,
): Promise<WithContext<ProfilePage> | undefined> => {
  if (!cloudProvider) {
    return;
  }

  const webPage = await getWebPage({
    title: cloudProvider.name,
    path: `/provider/${cloudProvider.slug}`,
    datePublished: cloudProvider._createdAt,
    dateModified: cloudProvider._updatedAt ?? undefined,
    parentPageSlug: 'providers',
  });

  const sameAs = [];

  if (cloudProvider.linkedin) {
    sameAs.push(cloudProvider.linkedin);
  }

  const image = [urlFor(cloudProvider.mark ?? '').url()];

  if (cloudProvider.logo) {
    image.push(urlFor(cloudProvider.logo).url());
  }

  return {
    ...webPage,
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Organization',
      name: cloudProvider.name,
      alternateName: cloudProvider.abbreviation ?? undefined,
      identifier: cloudProvider._id,
      description: cloudProvider.description,
      url: cloudProvider.website,
      sameAs,
      image,
    },
  };
};
