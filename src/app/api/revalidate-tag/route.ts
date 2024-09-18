import { revalidateSecret } from '@/lib/sanity/revalidateSecret';
import { parseBody } from 'next-sanity/webhook';
import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

type WebhookPayload = {
  tags: string[];
};

export async function POST(req: NextRequest) {
  try {
    if (!revalidateSecret) {
      return new Response(
        'Missing environment variable SANITY_REVALIDATE_SECRET',
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      revalidateSecret,
    );

    if (!isValidSignature) {
      const message = 'Invalid signature';
      return new Response(JSON.stringify({ message, isValidSignature, body }), {
        status: 401,
      });
    } else if (!body?.tags || body.tags.length === 0) {
      const message = 'Bad request';
      return new Response(JSON.stringify({ message, body }), { status: 400 });
    }

    body.tags.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ body });
  } catch (err) {
    console.error(err);
    return new Response((err as Error).message, { status: 500 });
  }
}
