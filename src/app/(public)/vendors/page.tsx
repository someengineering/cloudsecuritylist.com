import { metadata as notFoundMetadata } from '@/app/not-found';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Vendors from '@/components/content/Vendors';
import PageHeader from '@/components/page/Header';
import JsonLd from '@/components/page/JsonLd';
import { getPage } from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { getWebPage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

const slug = 'vendors';

export async function generateMetadata(
  _props: object,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;
  const { title, description, unlisted } = (await getPage(slug)) ?? {};

  if (!title) {
    return notFoundMetadata;
  }

  return {
    title,
    description,
    openGraph: {
      ...parentMetadata.openGraph,
      url: `/${slug}`,
      title,
    },
    ...(unlisted ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function VendorsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    category: productCategories,
    type: organizationTypes,
    provider: supportedCloudProviders,
    q: searchQuery,
    isBot,
  } = await props.searchParams;

  const {
    title,
    description,
    _createdAt: datePublished,
    _updatedAt: dateModified,
  } = (await getPage(slug)) ?? {};

  if (!title) {
    notFound();
  }

  return (
    <>
      <JsonLd
        schema={await getWebPage({
          title,
          path: `/${slug}`,
          datePublished,
          dateModified,
        })}
      />
      <PageHeader title={title} description={description} />
      <Suspense fallback={<LoadingSpinner />}>
        <Vendors
          filters={{
            productCategories:
              typeof productCategories === 'string'
                ? isValidSlug(productCategories)
                  ? [productCategories]
                  : []
                : (productCategories ?? []).filter((category) =>
                    isValidSlug(category),
                  ),
            organizationTypes:
              typeof organizationTypes === 'string'
                ? (Object.values(ORGANIZATION_TYPE) as string[]).includes(
                    organizationTypes,
                  )
                  ? [organizationTypes as ORGANIZATION_TYPE]
                  : []
                : ((organizationTypes ?? []).filter((type) =>
                    (Object.values(ORGANIZATION_TYPE) as string[]).includes(
                      type,
                    ),
                  ) as ORGANIZATION_TYPE[]),
            supportedCloudProviders:
              typeof supportedCloudProviders === 'string'
                ? isValidSlug(supportedCloudProviders)
                  ? [supportedCloudProviders]
                  : []
                : (supportedCloudProviders ?? []).filter((provider) =>
                    isValidSlug(provider),
                  ),
            searchQuery:
              typeof searchQuery === 'string'
                ? searchQuery
                : searchQuery?.join(' '),
          }}
          paginated={!isBot}
        />
      </Suspense>
    </>
  );
}
