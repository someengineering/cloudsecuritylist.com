import { submitUrls } from '@/lib/indexnow';
import { cronSecret } from '@/lib/indexnow/cronSecret';
import { type NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  if (!cronSecret) {
    return new Response('Missing CRON_SECRET', { status: 500 });
  }

  if (req.headers.get('Authorization') !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await submitUrls();

    return new Response();
  } catch (err) {
    console.error(err);

    return new Response((err as Error).message, { status: 500 });
  }
}
