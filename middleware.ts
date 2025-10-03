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
  const refreshToken = req.cookies.get('refresh_token')?.value;
  
  // Also check for camelCase versions for backward compatibility
  const idTokenAlt = req.cookies.get('idToken')?.value;
  const accessTokenAlt = req.cookies.get('accessToken')?.value;
  
  const hasAnyToken = !!(idToken || accessToken || refreshToken || idTokenAlt || accessTokenAlt);
  
  console.log('[ProjectMngnt Middleware] Auth check:', {
    pathname,
    hasIdToken: !!idToken,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    hasIdTokenAlt: !!idTokenAlt,
    hasAccessTokenAlt: !!accessTokenAlt,
    allCookies: req.cookies.getAll().map(c => `${c.name}=${c.value?.substring(0, 20)}...`)
  });
  
  if (hasAnyToken) {
    console.log('[ProjectMngnt Middleware] ✅ User authenticated via cookies, allowing access');
    return NextResponse.next();
  }

  // Avoid redirect loops for callback routes
  if (pathname.startsWith('/callback') || pathname.startsWith('/auth') || pathname.startsWith('/oauth2callback')) {
    return NextResponse.next();
  }

  // Redirect to central auth page with return URL
  const nextUrl = encodeURIComponent(href);
  console.log('[ProjectMngnt Middleware] ❌ No auth token found, redirecting to central auth:', nextUrl);
  return NextResponse.redirect(`https://auth.brmh.in/login?next=${nextUrl}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
