import { assertValue } from '@/utils/env';

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
  new Date().toISOString().split('T')[0];

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID',
);
