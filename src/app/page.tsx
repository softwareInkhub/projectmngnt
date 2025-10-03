'use client';

import ClientLayout from './components/ClientLayout';
import { UserProvider } from './contexts/UserContext';

export default function Home() {
  return (
    <UserProvider>
      <ClientLayout />
    </UserProvider>
  );
}