import { projectId } from '@/lib/sanity/env';
import { NextRequest, NextResponse, userAgent } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - apple-touch-icon (Apple touch icon files)
     * - icon- (icon files)
     * - icon.svg (SVG icon file)
     * - site.webmanifest (web manifest file)
     */
    {
      source:
        '/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon|icon-|icon.svg|site.webmanifest).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};

export function middleware(request: NextRequest) {
  const { isBot } = userAgent(request);

  if (isBot) {
    request.nextUrl.searchParams.set('isBot', '1');

    return NextResponse.rewrite(request.nextUrl);
  } else if (request.nextUrl.searchParams.has('isBot')) {
    request.nextUrl.searchParams.delete('isBot');

    return NextResponse.redirect(request.nextUrl);
  }

  const cspHeader = `
    default-src 'self';
    connect-src 'self'${
      request.nextUrl.pathname.startsWith('/studio')
        ? ['https', 'wss']
            .map((protocol) => ` ${protocol}://${projectId}.api.sanity.io`)
            .join('')
        : ''
    };
    script-src 'self' 'unsafe-inline'${
      process.env.NODE_ENV === 'production' ? '' : " 'unsafe-eval'"
    };
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.sanity.io ${
      request.nextUrl.pathname.startsWith('/studio')
        ? ' https://lh3.googleusercontent.com'
        : ''
    };
    media-src 'self';
    frame-src 'self';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
`
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}
