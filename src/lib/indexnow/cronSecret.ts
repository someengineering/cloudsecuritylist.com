import 'server-only';

import { experimental_taintUniqueValue } from 'react';

export const cronSecret = process.env.CRON_SECRET;

if (!cronSecret) {
  throw new Error('Missing environment variable: CRON_SECRET');
}

experimental_taintUniqueValue(
  'Do not pass the cron secret to the client.',
  process,
  cronSecret,
);
