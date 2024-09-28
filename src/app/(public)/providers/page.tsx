import { metadata as notFoundMetadata } from '@/app/not-found';
import CloudProviders from '@/components/content/CloudProviders';
import PageHeader from '@/components/page/Header';
import JsonLd from '@/components/page/JsonLd';
import { getPage } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

const slug = 'providers';

export async function generateMetadata(
  _props: object,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;
  const { title, description } = (await getPage(slug)) ?? {};

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
  };
}

export default async function ProvidersPage() {
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
      <CloudProviders />
    </>
  );
}
