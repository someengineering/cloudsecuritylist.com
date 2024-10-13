import 'server-only';

import { assertValue } from '@/utils/env';
import { experimental_taintUniqueValue } from 'react';

export const apiKey = assertValue(
  process.env.INDEXNOW_KEY,
  'Missing environment variable: INDEXNOW_KEY',
);

experimental_taintUniqueValue(
  'Do not pass the IndexNow API key to the client.',
  process,
  apiKey,
);
