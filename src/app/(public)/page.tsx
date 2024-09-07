import Vendors from '@/components/content/Vendors';
import PageHeading from '@/components/page/Heading';
import { getPage } from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { isValidSlug } from '@/utils/slug';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getPage('vendors')) ?? {};

  return {
    title,
    description,
  };
}

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { category: productCategories, type: organizationTypes } = searchParams;

  const { title, description } = (await getPage('vendors')) ?? {};

  return (
    <>
      <PageHeading title={title} description={description} />
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
        }}
      />
    </>
  );
}
