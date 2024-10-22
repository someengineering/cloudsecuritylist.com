import { metadata as notFoundMetadata } from '@/app/not-found';
import CloudProvider from '@/components/content/CloudProvider';
import JsonLd from '@/components/page/JsonLd';
import {
  getCloudProvider,
  getCloudProviderSlugs,
  getRedirect,
} from '@/lib/sanity';
import { getCloudProviderProfilePage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

export async function generateStaticParams() {
  return (await getCloudProviderSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const parentMetadata = await parent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images, ...parentOpenGraph } = parentMetadata.openGraph ?? {};

  const cloudProvider = isValidSlug(slug) ? await getCloudProvider(slug) : null;

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
      url: `/provider/${slug}`,
      title,
    },
  };
}

export default async function ProviderPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const cloudProvider = isValidSlug(slug) ? await getCloudProvider(slug) : null;

  if (!cloudProvider) {
    const redirectSlug = await getRedirect('cloudProvider', slug);

    if (redirectSlug) {
      permanentRedirect(`/provider/${redirectSlug}`);
    }

    notFound();
  }

  return (
    <>
      <JsonLd schema={await getCloudProviderProfilePage(cloudProvider)} />
      <CloudProvider provider={cloudProvider} />
    </>
  );
}
