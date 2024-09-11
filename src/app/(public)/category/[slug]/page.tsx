import ProductCategory from '@/components/content/ProductCategory';
import { getProductCategory, getProductCategorySlugs } from '@/lib/sanity';
import { isValidSlug } from '@/utils/slug';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getProductCategorySlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (!isValidSlug(params.slug)) {
    return {};
  }

  const productCategory = await getProductCategory(params.slug);

  if (productCategory === null) {
    return {};
  }

  return {
    title: productCategory.name,
    description: productCategory.description,
  };
}

export default async function OrganizationPage({
  params,
}: {
  params: { slug: string };
}) {
  if (!isValidSlug(params.slug)) {
    notFound();
  }

  const productCategory = await getProductCategory(params.slug);

  if (productCategory === null) {
    notFound();
  }
  return <ProductCategory productCategory={productCategory} />;
}
