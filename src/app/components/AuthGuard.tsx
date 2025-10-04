"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "./ClientLayout";
import { SSOUtils } from "../utils/sso-utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only run auth check once
    if (hasCheckedRef.current) {
      return;
    }

    const onAuthCheck = () => {
      console.log('[AuthGuard] Starting auth check for path:', pathname);
      
      // Allow public routes
      if (pathname?.startsWith('/oauth2callback') || pathname?.startsWith('/api')) {
        console.log('[AuthGuard] Public route detected, allowing access');
        setIsAuthed(true);
        setCheckingAuth(false);
        hasCheckedRef.current = true;
        return;
      }

      // Check authentication using SSO utils
      // Note: If middleware let the request through, httpOnly cookies are valid
      // The auth_valid flag will be set by middleware if httpOnly cookies exist
      const authed = SSOUtils.isAuthenticated();
      console.log('[AuthGuard] Authentication status:', { authed, pathname });
      
      if (!authed) {
        console.log('[AuthGuard] Not authenticated, redirecting to centralized auth');
        // Note: This shouldn't happen if middleware is working correctly
        // Middleware should have already redirected before reaching here
        const nextUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://auth.brmh.in/login?next=${nextUrl}`;
        hasCheckedRef.current = true;
        return;
      }
      
      console.log('[AuthGuard] User is authenticated, granting access');
      setIsAuthed(authed);
      setCheckingAuth(false);
      hasCheckedRef.current = true;
    };

    // Small delay to ensure SSO initialization is complete
    const timer = setTimeout(onAuthCheck, 200);
    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only render shell when authed
  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}

