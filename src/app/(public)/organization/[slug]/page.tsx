import Organization from '@/components/content/Organization';
import { getOrganization, getOrganizationSlugs } from '@/lib/sanity';
import { isValidSlug } from '@/utils/slug';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getOrganizationSlugs();

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

  const organization = await getOrganization(params.slug);

  if (organization === null) {
    return {};
  }

  return {
    title: organization.name,
    description: organization.description,
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

  const organization = await getOrganization(params.slug);

  if (organization === null) {
    notFound();
  }
  return <Organization organization={organization} />;
}
