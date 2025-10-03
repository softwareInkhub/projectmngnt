"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "./ClientLayout";
import { SSOUtils } from "../utils/sso-utils";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const onAuthCheck = () => {
      // Allow public routes
      if (pathname?.startsWith('/oauth2callback') || pathname?.startsWith('/api')) {
        setIsAuthed(true);
        setCheckingAuth(false);
        return;
      }

      // Check authentication using SSO utils
      const authed = SSOUtils.isAuthenticated();
      console.log('[AuthGuard] Authentication check:', { authed, pathname });
      
      if (!authed) {
        console.log('[AuthGuard] Not authenticated, redirecting to centralized auth');
        const nextUrl = encodeURIComponent(window.location.href);
        window.location.href = `https://auth.brmh.in/login?next=${nextUrl}`;
        return;
      }
      
      setIsAuthed(authed);
      setCheckingAuth(false);
    };

    // Small delay to ensure SSO initialization is complete
    const timer = setTimeout(onAuthCheck, 100);
    return () => clearTimeout(timer);
  }, [pathname, router]);

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

