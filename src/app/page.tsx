'use client';

import ClientLayout from './components/ClientLayout';
import { UserProvider } from './contexts/UserContext';
import { logAuthDebugInfo } from './utils/debug-auth';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Log auth debug info on page load
    logAuthDebugInfo();
  }, []);

  return (
    <UserProvider>
      <ClientLayout />
    </UserProvider>
  );
}