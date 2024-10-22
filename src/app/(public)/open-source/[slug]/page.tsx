import { metadata as notFoundMetadata } from '@/app/not-found';
import OpenSourceProject from '@/components/content/OpenSourceProject';
import JsonLd from '@/components/page/JsonLd';
import {
  getOpenSourceProject,
  getOpenSourceProjectSlugs,
  getRedirect,
} from '@/lib/sanity';
import { getOpenSourceProjectProfilePage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, permanentRedirect, redirect } from 'next/navigation';

export async function generateStaticParams() {
  return (await getOpenSourceProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const parentMetadata = await parent;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { images, ...parentOpenGraph } = parentMetadata.openGraph ?? {};

  const project = isValidSlug(slug) ? await getOpenSourceProject(slug) : null;

  if (!project) {
    return notFoundMetadata;
  }

  const { name: title, description } = project;

  return {
    title,
    description,
    openGraph: {
      ...parentOpenGraph,
      url: `/open-source/${slug}`,
      title,
    },
  };
}

export default async function OpenSourceProjectPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const project = isValidSlug(slug) ? await getOpenSourceProject(slug) : null;

  if (!project) {
    const redirectSlug = await getRedirect('openSourceProject', slug);

    if (redirectSlug) {
      permanentRedirect(`/open-source/${redirectSlug}`);
    }

    notFound();
  }

  if (project.name === project.organization?.name) {
    redirect(`/organization/${project.organization.slug}`);
  }

  return (
    <>
      <JsonLd schema={await getOpenSourceProjectProfilePage(project)} />
      <OpenSourceProject project={project} />
    </>
  );
}
