import Vendors from '@/components/content/Vendors';
import PageHeading from '@/components/page/Heading';
import { sanityFetch } from '@/lib/sanity/client';
import { PAGE_QUERY } from '@/lib/sanity/queries/page';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { PAGE_QUERYResult } from '@/lib/sanity/types';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } =
    (await sanityFetch<PAGE_QUERYResult>({
      query: PAGE_QUERY,
      params: { slug: 'vendors' },
      tags: ['page'],
    })) ?? {};

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

  const { title, description } =
    (await sanityFetch<PAGE_QUERYResult>({
      query: PAGE_QUERY,
      params: { slug: 'vendors' },
      tags: ['page'],
    })) ?? {};

  return (
    <>
      <PageHeading title={title} description={description} />
      <Vendors
        filters={{
          productCategories:
            typeof productCategories === 'string'
              ? [productCategories]
              : (productCategories ?? []),
          organizationTypes:
            typeof organizationTypes === 'string'
              ? Object.values<string>(ORGANIZATION_TYPE).includes(
                  organizationTypes,
                )
                ? [organizationTypes as ORGANIZATION_TYPE]
                : []
              : ((organizationTypes?.filter(
                  (type) => type in ORGANIZATION_TYPE,
                ) as ORGANIZATION_TYPE[]) ?? []),
        }}
      />
    </>
  );
}
