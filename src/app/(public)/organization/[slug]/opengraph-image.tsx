import Logo from '@/assets/logo-horizontal.svg';
import { sanityFetch } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';
import { ORGANIZATION_QUERY } from '@/lib/sanity/queries/organization';
import { ORGANIZATION_QUERYResult } from '@/lib/sanity/types';
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
    (await sanityFetch<ORGANIZATION_QUERYResult>({
      query: ORGANIZATION_QUERY,
      params: { slug: params.slug },
      tags: [`organization:${params.slug}`],
    })) ?? {};

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col justify-between"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #0891b2, #0e7490)',
        }}
      >
        <div tw="flex grow items-center p-14 text-white">
          <div tw="flex">
            {mark ? (
              // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
              <img
                src={urlFor(mark).url()}
                tw="mr-8 h-32 w-32 rounded-3xl bg-white p-6"
              />
            ) : null}
            <div tw="flex flex-col">
              <div tw="mt-7 text-7xl font-bold">{name}</div>
              <div tw="w-7/8 mt-7 text-4xl font-medium leading-none tracking-tight">
                {description}
              </div>
            </div>
          </div>
        </div>
        <div tw="flex bg-white p-6">
          <Logo tw="text-cyan-600" width={336} height={49} />
        </div>
      </div>
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
