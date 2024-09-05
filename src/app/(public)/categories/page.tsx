import ProductCategories from '@/components/content/ProductCategories';
import PageHeading from '@/components/page/Heading';
import { sanityFetch } from '@/lib/sanity/client';
import { PAGE_QUERY } from '@/lib/sanity/queries/page';
import { PAGE_QUERYResult } from '@/lib/sanity/types';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, shortTitle, description } =
    (await sanityFetch<PAGE_QUERYResult>({
      query: PAGE_QUERY,
      params: { slug: 'categories' },
      tags: ['page'],
    })) ?? {};

  return {
    title: shortTitle ?? title ?? 'Product categories',
    description,
  };
}

export default async function ProductCategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { segment: marketSegment } = searchParams;

  const { title, description } =
    (await sanityFetch<PAGE_QUERYResult>({
      query: PAGE_QUERY,
      params: { slug: 'categories' },
      tags: ['page'],
    })) ?? {};

  return (
    <>
      <PageHeading title={title} description={description} />
      <ProductCategories
        filters={{
          marketSegment:
            typeof marketSegment == 'string' ? marketSegment : undefined,
        }}
      />
    </>
  );
}
