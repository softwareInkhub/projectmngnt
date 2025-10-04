import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, href } = req.nextUrl

  // Allow auth page and static assets/api without redirect
  if (
    pathname.startsWith('/auth') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/debug-auth') ||
    pathname.startsWith('/debug-cookies')
  ) {
    return NextResponse.next()
  }

  // Check for SSO auth tokens in cookies (primary method)
  const idToken = req.cookies.get('id_token')?.value;
  const accessToken = req.cookies.get('access_token')?.value;
  
  if (idToken || accessToken) {
    console.log('[ProjectMngnt Middleware] User authenticated via SSO cookies, allowing access');
    
    // Create response and set a non-httpOnly auth flag cookie so client-side knows user is authenticated
    const response = NextResponse.next();
    
    // Set a client-readable flag (not httpOnly) so client-side code knows auth is valid
    // Use sameSite: 'none' for cross-subdomain cookies with secure: true
    response.cookies.set('auth_valid', '1', {
      path: '/',
      domain: '.brmh.in',
      secure: true,
      sameSite: 'none', // Changed from 'lax' to 'none' for cross-domain
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Important: client-side can read this
    });
    
    return response;
  }

  // Redirect to centralized auth with return URL
  const nextUrl = encodeURIComponent(href);
  console.log('[ProjectMngnt Middleware] No auth token found, redirecting to centralized auth');
  return NextResponse.redirect(`https://auth.brmh.in/login?next=${nextUrl}`);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
