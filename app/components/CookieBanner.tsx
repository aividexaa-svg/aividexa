"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "aividexa_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem(STORAGE_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9999] bg-[#0B0E14]/95 backdrop-blur border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm text-white/80 leading-relaxed">
          AI Videxa uses cookies to ensure security, improve performance, and
          enhance your experience. You can manage your preferences at any time.
          Read our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 text-white"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={rejectCookies}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white transition"
          >
            Reject
          </button>

          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm rounded-lg bg-white text-black font-medium hover:bg-white/90 transition"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
