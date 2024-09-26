import Logo from '@/assets/logo-horizontal.svg';
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
    })) ?? {};

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col justify-between"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #0891b2, #0e7490)',
        }}
      >
        <div tw="w-7/8 flex grow items-center p-14 text-7xl font-medium leading-none tracking-tight text-white">
          {headline}
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
            new URL('../../assets/fonts/NotoSans-Medium.ttf', import.meta.url),
          ).then((res) => res.arrayBuffer()),
        },
      ],
    },
  );
}
