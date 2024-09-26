import Acquisitions from '@/components/content/Acquisitions';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _props: object,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;

  const { title, description, slug } = (await getPage('acquisitions')) ?? {};

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

export default async function AcquisitionsPage() {
  const { title, description } = (await getPage('acquisitions')) ?? {};

  return (
    <>
      <PageHeader title={title} description={description} />
      <Acquisitions />
    </>
  );
}
