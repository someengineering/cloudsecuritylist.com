import 'server-only';

import { experimental_taintUniqueValue } from 'react';
import { assertValue } from '@/utils/env';

export const cronSecret = assertValue(
  process.env.CRON_SECRET,
  'Missing environment variable: CRON_SECRET',
);

experimental_taintUniqueValue(
  'Do not pass the cron secret to the client.',
  process,
  cronSecret,
);
