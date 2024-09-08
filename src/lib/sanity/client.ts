import 'server-only';

import { apiVersion, dataset, projectId } from '@/lib/sanity/env';
import { token } from '@/lib/sanity/token';
import { createClient, type QueryOptions, type QueryParams } from 'next-sanity';
import { draftMode } from 'next/headers';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    enabled: process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview',
    studioUrl: '/studio',
  },
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
  respectDraftMode = true,
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
  respectDraftMode?: boolean;
}) {
  const isDraftMode = respectDraftMode && draftMode().isEnabled;
  if (isDraftMode && !token) {
    throw new Error('Missing environment variable SANITY_API_READ_TOKEN');
  }

  let dynamicRevalidate = revalidate;
  if (isDraftMode) {
    // Do not cache in Draft Mode
    dynamicRevalidate = 0;
  } else if (tags.length) {
    // Cache indefinitely if tags supplied, purge with revalidateTag()
    dynamicRevalidate = false;
  }

  return client.fetch<QueryResponse>(query, params, {
    ...(isDraftMode &&
      ({
        token: token,
        perspective: 'previewDrafts',
        stega: true,
      } satisfies QueryOptions)),
    next: {
      revalidate: dynamicRevalidate,
      tags,
    },
  });
}
