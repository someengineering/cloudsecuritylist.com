import { metadata as notFoundMetadata } from '@/app/not-found';
import ProductCategory from '@/components/content/ProductCategory';
import JsonLd from '@/components/page/JsonLd';
import { getProductCategory, getProductCategorySlugs } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { toSentenceCase } from '@/utils/string';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return (await getProductCategorySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const parentMetadata = await parent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images, ...parentOpenGraph } = parentMetadata.openGraph ?? {};

  const category = isValidSlug(slug) ? await getProductCategory(slug) : null;

  if (!category) {
    return notFoundMetadata;
  }

  const { name, expansion, description } = category;
  const title = expansion ? `${toSentenceCase(expansion)} (${name})` : name;

  return {
    title,
    description,
    openGraph: {
      ...parentOpenGraph,
      url: `/category/${slug}`,
      title,
    },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const category = isValidSlug(slug) ? await getProductCategory(slug) : null;

  if (!category) {
    notFound();
  }

  return (
    <>
      <JsonLd
        schema={await getWebPage({
          title: category.name,
          path: `/category/${slug}`,
          datePublished: category._createdAt,
          dateModified: category._updatedAt,
          parentPageSlug: 'categories',
        })}
      />
      <ProductCategory category={category} />
    </>
  );
}
