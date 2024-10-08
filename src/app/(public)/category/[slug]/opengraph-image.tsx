import Layout from '@/components/opengraph/Layout';
import Summary from '@/components/opengraph/Summary';
import { sanityFetch } from '@/lib/sanity/client';
import { PRODUCT_CATEGORY_QUERY } from '@/lib/sanity/queries/productCategory';
import { PRODUCT_CATEGORY_QUERYResult } from '@/lib/sanity/types';
import { toSentenceCase } from '@/utils/string';
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
  const { name, expansion, description } =
    (await sanityFetch<PRODUCT_CATEGORY_QUERYResult>({
      query: PRODUCT_CATEGORY_QUERY,
      params: { slug: params.slug },
      tags: [`productCategory:${params.slug}`],
      allowDraftMode: false,
    })) ?? {};

  return new ImageResponse(
    (
      <Layout>
        <Summary
          title={
            expansion
              ? `${toSentenceCase(expansion ?? '')} (${name})`
              : toSentenceCase(name ?? '')
          }
          description={description ?? ''}
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
