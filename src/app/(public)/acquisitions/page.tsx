import { metadata as notFoundMetadata } from '@/app/not-found';
import Acquisitions from '@/components/content/Acquisitions';
import PageHeader from '@/components/page/Header';
import JsonLd from '@/components/page/JsonLd';
import { getPage } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

const slug = 'acquisitions';

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

export default async function AcquisitionsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { isBot } = await props.searchParams;
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
      <Acquisitions paginated={!isBot} />
    </>
  );
}
