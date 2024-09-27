import { metadata as notFoundMetadata } from '@/app/not-found';
import ProductCategory from '@/components/content/ProductCategory';
import { getProductCategory, getProductCategorySlugs } from '@/lib/sanity';
import { isValidSlug } from '@/utils/slug';
import { toSentenceCase } from '@/utils/string';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getProductCategorySlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  {
    params,
  }: {
    params: { slug: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images, ...parentOpenGraph } = parentMetadata.openGraph ?? {};

  const productCategory = isValidSlug(params.slug)
    ? await getProductCategory(params.slug)
    : null;

  if (!productCategory) {
    return notFoundMetadata;
  }

  const { name, expansion, description } = productCategory;
  const title = expansion ? `${toSentenceCase(expansion)} (${name})` : name;

  return {
    title,
    description,
    openGraph: {
      ...parentOpenGraph,
      url: `/category/${params.slug}`,
      title,
    },
  };
}

export default async function OrganizationPage({
  params,
}: {
  params: { slug: string };
}) {
  const productCategory = isValidSlug(params.slug)
    ? await getProductCategory(params.slug)
    : null;

  if (!productCategory) {
    notFound();
  }

  return <ProductCategory productCategory={productCategory} />;
}
