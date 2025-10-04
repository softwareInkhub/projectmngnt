import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Get all cookies from the request
  const cookies = req.cookies.getAll();
  
  // Check for auth tokens
  const idToken = req.cookies.get('id_token')?.value;
  const accessToken = req.cookies.get('access_token')?.value;
  const refreshToken = req.cookies.get('refresh_token')?.value;
  
  // Check for auth_valid flags
  const authValid = req.cookies.get('auth_valid')?.value;
  const authValidLocal = req.cookies.get('auth_valid_local')?.value;
  
  const hasAnyToken = !!(idToken || accessToken || refreshToken);
  const hasAuthValid = !!(authValid || authValidLocal);
  
  console.log('[Debug API] Cookie check:', {
    hasIdToken: !!idToken,
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    hasAnyToken,
    authValid: !!authValid,
    authValidLocal: !!authValidLocal,
    hasAuthValid,
  });
  
  return NextResponse.json({
    success: true,
    cookies: cookies.map(c => ({ name: c.name, hasValue: !!c.value })),
    auth: {
      hasIdToken: !!idToken,
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasAnyToken,
      authValid: !!authValid,
      authValidLocal: !!authValidLocal,
      hasAuthValid,
    },
    timestamp: new Date().toISOString(),
  });
}
