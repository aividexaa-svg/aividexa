"use client";

import { useState } from "react";
import { useCookiePreferences } from "@/app/context/CookieContext";

export default function CookiePreferencesModal() {
  const {
    preferences,
    setPreferences,
    isOpen,
    closePreferences,
  } = useCookiePreferences();

  const [analytics, setAnalytics] = useState(preferences.analytics);
  const [marketing, setMarketing] = useState(preferences.marketing);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[#111] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
        <h2 className="text-lg font-semibold mb-3 text-white">
          Cookie Preferences
        </h2>

        <p className="text-xs text-gray-400 mb-5">
          We use cookies to improve your experience. You can choose which
          cookies to allow.
        </p>

        {/* Strictly Necessary */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-white font-medium">
              Necessary Cookies
            </p>
            <p className="text-xs text-gray-400">
              Required for the site to function.
            </p>
          </div>
          <input
            type="checkbox"
            checked
            disabled
            className="accent-purple-500"
          />
        </div>

        {/* Analytics */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-white font-medium">
              Analytics Cookies
            </p>
            <p className="text-xs text-gray-400">
              Help us improve AI Videxa.
            </p>
          </div>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="accent-purple-500"
          />
        </div>

        {/* Marketing */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm text-white font-medium">
              Marketing Cookies
            </p>
            <p className="text-xs text-gray-400">
              Used for personalized offers.
            </p>
          </div>
          <input
            type="checkbox"
            checked={marketing}
            onChange={(e) => setMarketing(e.target.checked)}
            className="accent-purple-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={closePreferences}
            className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              setPreferences({
                analytics,
                marketing,
              })
            }
            className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
