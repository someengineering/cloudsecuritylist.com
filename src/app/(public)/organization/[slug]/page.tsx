import { metadata as notFoundMetadata } from '@/app/not-found';
import Organization from '@/components/content/Organization';
import JsonLd from '@/components/page/JsonLd';
import {
  getOrganization,
  getOrganizationSlugs,
  getRedirect,
} from '@/lib/sanity';
import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { getOrganizationProfilePage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

export async function generateStaticParams() {
  return (await getOrganizationSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const parentMetadata = await parent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images, ...parentOpenGraph } = parentMetadata.openGraph ?? {};

  const organization = isValidSlug(slug) ? await getOrganization(slug) : null;

  if (
    !organization ||
    (organization.organizationType === ORGANIZATION_TYPE.ACQUIRED &&
      !(
        'parentOrganization' in organization &&
        organization.parentOrganization?.slug
      ))
  ) {
    return notFoundMetadata;
  }

  const { name: title, description } = organization;

  return {
    title,
    description,
    openGraph: {
      ...parentOpenGraph,
      url: `/organization/${slug}`,
      title,
    },
  };
}

export default async function OrganizationPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const organization = isValidSlug(slug) ? await getOrganization(slug) : null;

  if (!organization) {
    const redirectSlug = await getRedirect('organization', slug);

    if (redirectSlug) {
      permanentRedirect(`/organization/${redirectSlug}`);
    }

    notFound();
  }

  if (organization.organizationType === ORGANIZATION_TYPE.ACQUIRED) {
    if (
      'parentOrganization' in organization &&
      organization.parentOrganization?.slug
    ) {
      permanentRedirect(
        `/organization/${organization.parentOrganization.slug}#${organization.slug}`,
      );
    }

    notFound();
  }

  return (
    <>
      <JsonLd schema={await getOrganizationProfilePage(organization)} />
      <Organization organization={organization} />
    </>
  );
}
