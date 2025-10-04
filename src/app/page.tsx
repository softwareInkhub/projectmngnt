import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default function Home() {
  // Check for auth tokens in cookies (server-side)
  const idToken = cookies().get('id_token')?.value;
  const accessToken = cookies().get('access_token')?.value;
  const refreshToken = cookies().get('refresh_token')?.value;
  
  // If authenticated, redirect to dashboard
  if (idToken || accessToken || refreshToken) {
    redirect('/dashboard');
  }
  
  // If not authenticated, middleware will redirect to auth.brmh.in
  // This line should never be reached, but just in case:
  redirect('/dashboard');
}