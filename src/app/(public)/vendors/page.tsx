import Vendors from '@/components/content/Vendors';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _props: object,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;

  const { title, description, slug } = (await getPage('vendors')) ?? {};

  return {
    title,
    description,
    openGraph: {
      ...parentMetadata.openGraph,
      url: `/${slug}`,
      title,
    },
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
  } = searchParams;

  const { title, description } = (await getPage('vendors')) ?? {};

  return (
    <>
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
        }}
      />
    </>
  );
}
