import Layout from '@/components/opengraph/Layout';
import Summary from '@/components/opengraph/Summary';
import { sanityFetch } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { CLOUD_PROVIDER_QUERY } from '@/lib/sanity/queries/cloudProvider';
import { CLOUD_PROVIDER_QUERYResult } from '@/lib/sanity/types';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function OpenGraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const { name, description, mark } =
    (await sanityFetch<CLOUD_PROVIDER_QUERYResult>({
      query: CLOUD_PROVIDER_QUERY,
      params: { slug: params.slug },
      tags: [`cloudProvider:${params.slug}`],
    })) ?? {};

  return new ImageResponse(
    (
      <Layout>
        <Summary
          title={name ?? ''}
          description={description ?? ''}
          logo={urlFor(mark ?? '').url()}
        />
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
            new URL(
              '../../../../assets/fonts/NotoSans-Medium.ttf',
              import.meta.url,
            ),
          ).then((res) => res.arrayBuffer()),
        },
        {
          name: 'Noto Sans',
          style: 'normal',
          weight: 700,
          data: await fetch(
            new URL(
              '../../../../assets/fonts/NotoSans-Bold.ttf',
              import.meta.url,
            ),
          ).then((res) => res.arrayBuffer()),
        },
      ],
    },
  );
}
