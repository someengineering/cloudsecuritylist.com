import Logo from '@/assets/logo-horizontal.svg';
import { getSiteSettings } from '@/lib/sanity';
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

export default async function OpenGraphImage() {
  const { headline } = (await getSiteSettings()) ?? {};

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
          data: await readFile(
            join(__dirname, '../../assets/fonts/NotoSans-Medium.ttf'),
          ),
        },
      ],
    },
  );
}
