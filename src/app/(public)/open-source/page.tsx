import { metadata as notFoundMetadata } from '@/app/not-found';
import OpenSourceProjects from '@/components/content/OpenSourceProjects';
import PageHeader from '@/components/page/Header';
import JsonLd from '@/components/page/JsonLd';
import { getPage } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

const slug = 'open-source';

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
    ...(unlisted ? { robots: { index: false, follow: false } } : null),
  };
}

export default async function OpenSourcePage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const {
    category: productCategories,
    provider: supportedCloudProviders,
    q: searchQuery,
    isBot,
  } = await props.searchParams;

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
      <OpenSourceProjects
        filters={{
          productCategories:
            typeof productCategories === 'string'
              ? isValidSlug(productCategories)
                ? [productCategories]
                : []
              : (productCategories ?? []).filter((category) =>
                  isValidSlug(category),
                ),
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
