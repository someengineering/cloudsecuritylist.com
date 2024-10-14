import 'server-only';

import { assertValue } from '@/utils/env';
import { experimental_taintUniqueValue } from 'react';

export const token = assertValue(
  process.env.SANITY_API_READ_TOKEN,
  'Missing environment variable: SANITY_API_READ_TOKEN',
);

experimental_taintUniqueValue(
  'Do not pass the Sanity API read token to the client.',
  process,
  token,
);
