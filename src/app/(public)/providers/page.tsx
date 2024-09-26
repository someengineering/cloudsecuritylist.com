import CloudProviders from '@/components/content/CloudProviders';
import PageHeader from '@/components/page/Header';
import { getPage } from '@/lib/sanity';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata(
  _props: object,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const parentMetadata = await parent;

  const { title, description, slug } = (await getPage('providers')) ?? {};

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
  const { title, description } = (await getPage('providers')) ?? {};

  return (
    <>
      <PageHeader title={title} description={description} />
      <CloudProviders />
    </>
  );
}
