import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname, href } = req.nextUrl;

  // Allow public files, API routes, and debug page
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/debug-auth') ||  // Allow debug page without auth
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
  
  // Get all cookies for debugging
  const allCookies = req.cookies.getAll();
  const cookieNames = allCookies.map(c => c.name);
  
  console.log('[ProjectMngnt Middleware] ==================');
  console.log('[ProjectMngnt Middleware] Auth check for:', pathname);
  console.log('[ProjectMngnt Middleware] URL:', href);
  console.log('[ProjectMngnt Middleware] All cookie names:', cookieNames);
  console.log('[ProjectMngnt Middleware] Has id_token:', !!idToken);
  console.log('[ProjectMngnt Middleware] Has access_token:', !!accessToken);
  console.log('[ProjectMngnt Middleware] Has refresh_token:', !!refreshToken);
  console.log('[ProjectMngnt Middleware] Total cookies:', allCookies.length);
  
  // Log first 50 chars of each cookie
  allCookies.forEach(c => {
    console.log(`[ProjectMngnt Middleware] Cookie: ${c.name} = ${c.value?.substring(0, 50)}...`);
  });
  
  console.log('[ProjectMngnt Middleware] Has ANY token?', hasAnyToken);
  console.log('[ProjectMngnt Middleware] ==================');
  
  if (hasAnyToken) {
    console.log('[ProjectMngnt Middleware] ✅ User authenticated via cookies, allowing access');
    
    // Create response and set a non-httpOnly auth flag cookie so client-side knows user is authenticated
    const response = NextResponse.next();
    
    // Set a client-readable flag (not httpOnly) so client-side code knows auth is valid
    // Set with dot-domain for cross-subdomain access
    response.cookies.set('auth_valid', '1', {
      path: '/',
      domain: '.brmh.in',
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Important: client-side can read this
    });
    
    // Also set for current domain as fallback
    response.cookies.set('auth_valid_local', '1', {
      path: '/',
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false,
    });
    
    console.log('[ProjectMngnt Middleware] 🍪 Set auth_valid cookies (both .brmh.in and local domain)');
    
    return response;
  }

  // Avoid redirect loops for callback routes
  if (pathname.startsWith('/callback') || pathname.startsWith('/auth') || pathname.startsWith('/oauth2callback')) {
    return NextResponse.next();
  }

  // Redirect to central auth page with return URL
  // Default to dashboard if no specific page was requested
  const returnUrl = pathname === '/' 
    ? 'https://projectmanagement.brmh.in/dashboard'
    : href;
  const nextUrl = encodeURIComponent(returnUrl);
  console.log('[ProjectMngnt Middleware] ❌ No auth token found, redirecting to central auth:', nextUrl);
  return NextResponse.redirect(`https://auth.brmh.in/login?next=${nextUrl}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
