import { assertValue } from '@/utils/env';

export const indexnowKey = assertValue(
  process.env.NEXT_PUBLIC_INDEXNOW_KEY,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET',
);
