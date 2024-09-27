import { metadata as notFoundMetadata } from '@/app/not-found';
import CloudProvider from '@/components/content/CloudProvider';
import JsonLd from '@/components/page/JsonLd';
import { getCloudProvider, getCloudProviderSlugs } from '@/lib/sanity';
import { getCloudProviderProfilePage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getCloudProviderSlugs();

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

  const cloudProvider = isValidSlug(params.slug)
    ? await getCloudProvider(params.slug)
    : null;

  if (!cloudProvider) {
    return notFoundMetadata;
  }

  const { name, abbreviation, description } = cloudProvider;
  const title = `${name}${abbreviation ? ` (${abbreviation})` : ''}`;

  return {
    title,
    description,
    openGraph: {
      ...parentOpenGraph,
      url: `/provider/${params.slug}`,
      title,
    },
  };
}

export default async function OrganizationPage({
  params,
}: {
  params: { slug: string };
}) {
  const cloudProvider = isValidSlug(params.slug)
    ? await getCloudProvider(params.slug)
    : null;

  if (!cloudProvider) {
    notFound();
  }

  return (
    <>
      <JsonLd schema={await getCloudProviderProfilePage(cloudProvider)} />
      <CloudProvider cloudProvider={cloudProvider} />
    </>
  );
}
