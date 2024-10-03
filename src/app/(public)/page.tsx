import FeaturedPages from '@/components/content/FeaturedPages';
import PageHeader from '@/components/page/Header';
import JsonLd from '@/components/page/JsonLd';
import { getSiteSettings } from '@/lib/sanity';
import { getWebPage } from '@/utils/jsonLd';
import { PortableTextBlock } from '@portabletext/types';

export default async function HomePage() {
  const { name, heroTitle, heroDescription, featuredPages } =
    (await getSiteSettings()) ?? {};

  return (
    <>
      <JsonLd schema={await getWebPage({ title: name ?? '', path: '/' })} />
      <PageHeader
        title={heroTitle as PortableTextBlock}
        description={heroDescription as PortableTextBlock[]}
      />
      <FeaturedPages pages={featuredPages ?? []} />
    </>
  );
}
