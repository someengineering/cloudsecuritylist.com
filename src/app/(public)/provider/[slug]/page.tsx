import CloudProvider from '@/components/content/CloudProvider';
import { getCloudProvider, getCloudProviderSlugs } from '@/lib/sanity';
import { isValidSlug } from '@/utils/slug';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getCloudProviderSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  if (!isValidSlug(params.slug)) {
    return {};
  }

  const cloudProvider = await getCloudProvider(params.slug);

  if (cloudProvider === null) {
    return {};
  }

  return {
    title: cloudProvider.name,
    description: cloudProvider.description,
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
