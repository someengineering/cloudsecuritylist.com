import { metadata as notFoundMetadata } from '@/app/not-found';
import Vendors from '@/components/content/Vendors';
import PageHeader from '@/components/page/Header';
import JsonLd from '@/components/page/JsonLd';
import { getPage } from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { getWebPage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

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

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const {
    category: productCategories,
    type: organizationTypes,
    provider: supportedCloudProviders,
    q: searchQuery,
    isBot,
  } = searchParams;

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
              ? organizationTypes in ORGANIZATION_TYPE
                ? [organizationTypes as ORGANIZATION_TYPE]
                : []
              : ((organizationTypes ?? []).filter(
                  (type) => type in ORGANIZATION_TYPE,
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
          paginated: !isBot,
        }}
      />
    </>
  );
}
