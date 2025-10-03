import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname, href } = req.nextUrl;

  // Allow public files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check for auth token in cookies (set by backend)
  const idToken = req.cookies.get('id_token')?.value;
  const accessToken = req.cookies.get('access_token')?.value;
  
  console.log('[Middleware] Checking authentication:', {
    pathname,
    hasIdTokenCookie: !!idToken,
    hasAccessTokenCookie: !!accessToken,
    cookies: req.cookies.getAll().map(c => c.name)
  });
  
  if (idToken || accessToken) {
    console.log('[Middleware] User authenticated via cookies, allowing access');
    return NextResponse.next();
  }

  // Avoid redirect loops for callback routes
  if (pathname.startsWith('/callback') || pathname.startsWith('/auth') || pathname.startsWith('/oauth2callback')) {
    return NextResponse.next();
  }

  // Redirect to central auth page with return URL
  const nextUrl = encodeURIComponent(href);
  console.log('[Middleware] No auth token found, redirecting to central auth:', nextUrl);
  return NextResponse.redirect(`https://auth.brmh.in/login?next=${nextUrl}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
