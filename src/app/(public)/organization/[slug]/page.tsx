import Organization from '@/components/content/Organization';
import { getOrganization, getOrganizationSlugs } from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getOrganizationSlugs();

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
    (await getOrganization(params.slug)) ?? {};

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

  const organization = await getOrganization(params.slug);

  if (organization === null) {
    notFound();
  }

  if (organization.organizationType === ORGANIZATION_TYPE.ACQUIRED) {
    if (
      'parentOrganization' in organization &&
      organization.parentOrganization?.slug
    ) {
      redirect(
        `/organization/${organization.parentOrganization.slug}#${organization.slug}`,
      );
    }

    notFound();
  }

  return <Organization organization={organization} />;
}
