import Headline from '@/components/opengraph/Headline';
import Layout from '@/components/opengraph/Layout';
import { sanityFetch } from '@/lib/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries/siteSettings';
import { SITE_SETTINGS_QUERYResult } from '@/lib/sanity/types';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const { headline } =
    (await sanityFetch<SITE_SETTINGS_QUERYResult>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
      allowDraftMode: false,
    })) ?? {};

  return new ImageResponse(
    (
      <Layout>
        <Headline text={headline ?? ''} />
      </Layout>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Noto Sans',
          style: 'normal',
          weight: 500,
          data: await fetch(
            new URL('../../assets/fonts/NotoSans-Medium.ttf', import.meta.url),
          ).then((res) => res.arrayBuffer()),
        },
      ],
    },
  );
}
