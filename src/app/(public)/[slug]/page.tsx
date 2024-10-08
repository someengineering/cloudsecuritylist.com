import { metadata as notFoundMetadata } from '@/app/not-found';
import JsonLd from '@/components/page/JsonLd';
import MainText from '@/components/page/MainText';
import { getPage, getPageSlugs, getRedirect } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { PortableTextBlock } from '@portabletext/types';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export async function generateStaticParams() {
  const slugs = await getPageSlugs();

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
  const { title, longTitle, description, unlisted } =
    (await getPage(params.slug)) ?? {};

  if (!title) {
    return notFoundMetadata;
  }

  return {
    title,
    description,
    openGraph: {
      ...parentMetadata.openGraph,
      url: `/${params.slug}`,
      title: longTitle ?? title,
    },
    ...(unlisted ? { robots: { index: false, follow: false } } : null),
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const {
    title,
    longTitle,
    textContent,
    displayUpdatedAt,
    _createdAt: datePublished,
    _updatedAt: dateModified,
  } = (isValidSlug(params.slug) && (await getPage(params.slug))) || {};

  if (!title || !textContent) {
    const redirectSlug = await getRedirect('page', params.slug);

    if (redirectSlug) {
      redirect(`/${redirectSlug}`);
    }

    notFound();
  }

  return (
    <>
      <JsonLd
        schema={await getWebPage({
          title: longTitle ?? title,
          path: `/${params.slug}`,
          datePublished,
          dateModified,
        })}
      />
      <MainText
        title={longTitle ?? title}
        blocks={textContent as PortableTextBlock[]}
        lastUpdated={(displayUpdatedAt && dateModified) || undefined}
      />
    </>
  );
}
