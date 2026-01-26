import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contextAuth/AuthContext";

import { CookieProvider } from "@/app/context/CookieContext";   // ✅ SAME FILE
import CookieBanner from "./components/CookieBanner";
import CookiePreferencesModal from "@/app/components/CookiePreferencesModal";

export const metadata: Metadata = {
  title: "AI Videxa",
  description: "Free AI academic assistant for students",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>

          {/* 🔥 COOKIE CONTEXT MUST WRAP EVERYTHING */}
          <CookieProvider>
            {children}

            {/* global cookie UI */}
            <CookieBanner />
            <CookiePreferencesModal />
          </CookieProvider>

        </AuthProvider>
      </body>
    </html>
  );
}
