"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type CookiePrefs = {
  analytics: boolean;
  marketing: boolean;
};

type CookieContextType = {
  preferences: CookiePrefs;
  setPreferences: (prefs: CookiePrefs) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  isOpen: boolean;
  hasConsented: boolean;
};

const CookieContext = createContext<CookieContextType | null>(null);

export const CookieProvider = ({ children }: { children: React.ReactNode }) => {
  const [preferences, setPreferencesState] = useState<CookiePrefs>({
    analytics: false,
    marketing: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cookiePreferences");
    if (stored) {
      setPreferencesState(JSON.parse(stored));
      setHasConsented(true);
    }
  }, []);

  const setPreferences = (prefs: CookiePrefs) => {
    setPreferencesState(prefs);
    localStorage.setItem("cookiePreferences", JSON.stringify(prefs));
    setHasConsented(true);
    setIsOpen(false);
  };

  const openPreferences = () => setIsOpen(true);
  const closePreferences = () => setIsOpen(false);

  return (
    <CookieContext.Provider
      value={{
        preferences,
        setPreferences,
        openPreferences,
        closePreferences,
        isOpen,
        hasConsented,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookiePreferences = () => {
  const ctx = useContext(CookieContext);
  if (!ctx) {
    throw new Error("useCookiePreferences must be used within CookieProvider");
  }
  return ctx;
};
