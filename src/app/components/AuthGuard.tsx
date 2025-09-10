"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Allow unauthenticated access to the auth page itself
    if (pathname?.startsWith("/authPage")) {
      setCheckingAuth(false);
      return;
    }

    try {
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const idToken = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;

      if (!accessToken || !idToken || accessToken === 'mock-token-disabled') {
        router.push('/authPage');
      }
    } finally {
      setCheckingAuth(false);
    }
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

  return <>{children}</>;
}
