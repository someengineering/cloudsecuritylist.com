import CloudProvider from '@/components/content/CloudProvider';
import { getCloudProvider, getCloudProviderSlugs } from '@/lib/sanity';
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

  if (!isValidSlug(params.slug)) {
    return {};
  }

  const { name: title, description } =
    (await getCloudProvider(params.slug)) ?? {};

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
  if (!isValidSlug(params.slug)) {
    notFound();
  }

  const cloudProvider = await getCloudProvider(params.slug);

  if (cloudProvider === null) {
    notFound();
  }
  return <CloudProvider cloudProvider={cloudProvider} />;
}
