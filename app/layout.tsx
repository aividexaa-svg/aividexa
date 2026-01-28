import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contextAuth/AuthContext";
import { CookieProvider } from "@/app/context/CookieContext";
import CookieBanner from "./components/CookieBanner";
import CookiePreferencesModal from "@/app/components/CookiePreferencesModal";

/* ✅ PAGE METADATA */
export const metadata: Metadata = {
  title: "AI Videxa",
  description: "Free AI academic assistant for students",
  icons: { icon: "/favicon.ico" },
};

/* ✅ VIEWPORT CONTROLS (THIS FIXES THE BLACK PATCH) */
export const viewport: Viewport = {
  themeColor: "#05070c",   // 🔥 ANDROID URL BAR / VIEWPORT COLOR
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-transparent">
        <AuthProvider>
          <CookieProvider>
            <div className="relative min-h-[100svh] z-0">
              {children}
            </div>

            <CookieBanner />
            <CookiePreferencesModal />
          </CookieProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
