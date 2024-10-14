import 'server-only';

import { assertValue } from '@/utils/env';
import { experimental_taintUniqueValue } from 'react';

export const cronSecret = assertValue(
  process.env.CRON_SECRET,
  'Missing environment variable: CRON_SECRET',
);

experimental_taintUniqueValue(
  'Do not pass the cron secret to the client.',
  process,
  cronSecret,
);
