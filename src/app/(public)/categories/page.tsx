import ProductCategories from '@/components/content/ProductCategories';

export default async function ProductCategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { segment: marketSegment } = searchParams;

  return (
    <ProductCategories
      filters={{
        marketSegment:
          typeof marketSegment == 'string' ? marketSegment : undefined,
      }}
    />
  );
}
