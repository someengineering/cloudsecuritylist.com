import ProductCategories from '@/components/content/ProductCategories';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { isValidSlug } from '@/utils/slug';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = (await getPage('categories')) ?? {};

  return {
    title,
    description,
  };
}

export default async function ProductCategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { segment: marketSegment } = searchParams;

  const { title, description } = (await getPage('categories')) ?? {};

  return (
    <>
      <PageHeader title={title} description={description} />
      <ProductCategories
        filters={{
          marketSegment:
            typeof marketSegment == 'string' && isValidSlug(marketSegment)
              ? marketSegment
              : undefined,
        }}
      />
    </>
  );
}
