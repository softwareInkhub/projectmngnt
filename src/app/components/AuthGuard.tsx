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

    const onAuthCheck = async () => {
      console.log('[AuthGuard] Starting auth check for path:', pathname);
      
      // Allow public routes
      if (pathname?.startsWith('/oauth2callback') || pathname?.startsWith('/api') || pathname?.startsWith('/debug')) {
        console.log('[AuthGuard] Public route detected, allowing access');
        setIsAuthed(true);
        setCheckingAuth(false);
        hasCheckedRef.current = true;
        return;
      }

      // IMPORTANT: If we got this far, the middleware already checked httpOnly cookies
      // The middleware would have redirected us if we weren't authenticated
      // So we can trust we're authenticated, but let's verify and sync user data
      
      console.log('[AuthGuard] Page loaded - middleware approved access');
      console.log('[AuthGuard] Checking auth flags...');
      
      // Check if we have any auth indication
      let authed = SSOUtils.isAuthenticated();
      console.log('[AuthGuard] Initial auth check:', { authed });
      
      if (!authed) {
        // Try to sync from backend (middleware approved us, so backend should confirm)
        console.log('[AuthGuard] No auth flag found, attempting backend sync...');
        try {
          await SSOUtils.syncTokensToLocalStorage();
          // Check again after sync
          authed = SSOUtils.isAuthenticated();
          console.log('[AuthGuard] After backend sync:', { authed });
        } catch (error) {
          console.error('[AuthGuard] Backend sync failed:', error);
        }
      }
      
      if (!authed) {
        // If still not authed after sync, redirect
        console.log('[AuthGuard] Still not authenticated after sync, redirecting...');
        const nextUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://auth.brmh.in/login?next=${nextUrl}`;
        hasCheckedRef.current = true;
        return;
      }
      
      console.log('[AuthGuard] User is authenticated, granting access');
      setIsAuthed(true);
      setCheckingAuth(false);
      hasCheckedRef.current = true;
    };

    // Small delay to ensure cookies are applied from middleware response
    const timer = setTimeout(onAuthCheck, 300);
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

