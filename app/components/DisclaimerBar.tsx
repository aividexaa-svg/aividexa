"use client";

import { useState } from "react";
import { useCookiePreferences } from "@/app/context/CookieContext";

export default function DisclaimerBar() {
  const [visible, setVisible] = useState(true);
  const { openPreferences } = useCookiePreferences(); // 🔗 REAL MODAL

  if (!visible) return null;

  return (
    <div className="mt-2 flex items-center justify-center gap-2 text-[11px] text-gray-400 relative">
      <p className="leading-snug text-center">
        For learning purposes only. AI Videxa can make mistakes.{" "}
        <span className="text-gray-300">
          Check important information.
        </span>{" "}
        <button
          onClick={openPreferences}   // ✅ CONNECTED
          className="
            text-blue-400 hover:text-blue-300
            underline underline-offset-2
            transition
          "
        >
          Cookie Preferences
        </button>
      </p>

      <button
        onClick={() => setVisible(false)}
        className="
          absolute right-3
          text-gray-500 hover:text-white
          transition text-xs
        "
        aria-label="Close disclaimer"
      >
        ✕
      </button>
    </div>
  );
}
