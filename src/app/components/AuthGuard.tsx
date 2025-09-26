"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ClientLayout from "./ClientLayout";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  useEffect(() => {
    const onAuthCheck = () => {
      // Allow unauthenticated access to the auth page itself
      if (pathname?.startsWith('/authPage')) {
        setIsAuthed(false);
        setCheckingAuth(false);
        return;
      }

      const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      const idToken = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
      const authed = !!accessToken && !!idToken && accessToken !== 'mock-token-disabled';
      setIsAuthed(authed);
      if (!authed) {
        router.push('/authPage');
      }
      setCheckingAuth(false);
    };

    onAuthCheck();
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

  // On auth routes, show the page content without shell
  if (pathname?.startsWith('/authPage')) return <>{children}</>;

  // On app routes, only render shell when authed
  if (!isAuthed) return null;

  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}

