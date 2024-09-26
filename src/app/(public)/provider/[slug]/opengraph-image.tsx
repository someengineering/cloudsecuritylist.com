import Logo from '@/assets/logo-horizontal.svg';
import { getCloudProvider } from '@/lib/sanity';
import { urlFor } from '@/lib/sanity/image';
import { ImageResponse } from 'next/og';

import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    (await getCloudProvider(params.slug)) ?? {};

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
          data: await readFile(
            join(__dirname, '../../../../assets/fonts/NotoSans-Medium.ttf'),
          ),
        },
        {
          name: 'Noto Sans',
          style: 'normal',
          weight: 700,
          data: await readFile(
            join(__dirname, '../../../../assets/fonts/NotoSans-Bold.ttf'),
          ),
        },
      ],
    },
  );
}
