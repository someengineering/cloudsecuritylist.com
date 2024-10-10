import { revalidateSecret } from '@/lib/sanity/revalidateSecret';
import { parseBody } from 'next-sanity/webhook';
import { revalidateTag } from 'next/cache';
import { type NextRequest } from 'next/server';

type WebhookPayload = {
  tags: string[];
};

export async function POST(req: NextRequest) {
  try {
    if (!revalidateSecret) {
      return new Response('Missing SANITY_REVALIDATE_SECRET', { status: 500 });
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      revalidateSecret,
    );

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 });
    } else if (!body?.tags?.length) {
      return new Response('Bad request', { status: 400 });
    }

    body.tags.forEach((tag) => revalidateTag(tag));

    return new Response();
  } catch (err) {
    console.error(err);

    return new Response((err as Error).message, { status: 500 });
  }
}
