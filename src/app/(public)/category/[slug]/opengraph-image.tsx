import Logo from '@/assets/logo-horizontal.svg';
import { getProductCategory } from '@/lib/sanity';
import { toSentenceCase } from '@/utils/string';
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
  const { name, expansion, description } =
    (await getProductCategory(params.slug)) ?? {};

  return new ImageResponse(
    (
      <div
        tw="flex h-full w-full flex-col justify-between bg-cyan-600"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #0891b2, #0e7490)',
        }}
      >
        <div tw="flex grow items-center p-8 text-white">
          <div tw="w-8/10 flex flex-col">
            <div tw="text-7xl font-bold">
              {expansion
                ? `${toSentenceCase(expansion ?? '')} (${name})`
                : toSentenceCase(name ?? '')}
            </div>
            <div tw="mt-7 text-4xl font-medium leading-none tracking-tight">
              {description}
            </div>
          </div>
        </div>
        <div tw="flex bg-white p-8">
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
