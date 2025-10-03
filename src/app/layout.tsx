import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthGuard from "./components/AuthGuard";
import { UserProvider } from "./contexts/UserContext";
import SSOInitializer from "./components/SSOInitializer";
// Shell is mounted from AuthGuard only when authed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRMH Project Management",
  description: "BRMH Project Management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}>
        <SSOInitializer>
          <UserProvider>
            <AuthGuard>
              {children}
            </AuthGuard>
          </UserProvider>
        </SSOInitializer>
      </body>
    </html>
  );
}