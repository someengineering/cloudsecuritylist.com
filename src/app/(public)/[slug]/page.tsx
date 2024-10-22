import { metadata as notFoundMetadata } from '@/app/not-found';
import MainText from '@/components/common/MainText';
import JsonLd from '@/components/page/JsonLd';
import { getPage, getPageSlugs, getRedirect } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { isValidSlug } from '@/utils/slug';
import { PortableTextBlock } from '@portabletext/types';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export async function generateStaticParams() {
  return (await getPageSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await props.params;
  const parentMetadata = await parent;
  const { title, longTitle, description, unlisted } =
    (await getPage(slug)) ?? {};

  if (!title) {
    return notFoundMetadata;
  }

  return {
    title,
    description,
    openGraph: {
      ...parentMetadata.openGraph,
      url: `/${slug}`,
      title: longTitle ?? title,
    },
    ...(unlisted ? { robots: { index: false, follow: false } } : null),
  };
}

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const {
    title,
    longTitle,
    textContent,
    nofollow,
    displayUpdatedAt,
    _createdAt: datePublished,
    _updatedAt: dateModified,
  } = (isValidSlug(slug) && (await getPage(slug))) || {};

  if (!title || !textContent) {
    const redirectSlug = await getRedirect('page', slug);

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
          path: `/${slug}`,
          datePublished,
          dateModified,
        })}
      />
      <MainText
        title={longTitle ?? title}
        blocks={textContent as PortableTextBlock[]}
        lastUpdated={(displayUpdatedAt && dateModified) || undefined}
        nofollowLinks={!!nofollow}
      />
    </>
  );
}
