import 'server-only';

import { experimental_taintUniqueValue } from 'react';

export const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

if (!revalidateSecret) {
  throw new Error('Missing SANITY_REVALIDATE_SECRET');
}

experimental_taintUniqueValue(
  'Do not pass the Sanity revalidate secret to the client.',
  process,
  revalidateSecret,
);
