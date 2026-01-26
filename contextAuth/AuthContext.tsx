"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  browserLocalPersistence,
  setPersistence,
  reload,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    const setup = async () => {
      await setPersistence(auth, browserLocalPersistence);

      const unsub = onAuthStateChanged(auth, async (u) => {
        if (u) {
          // ensure the latest Auth data (photoURL) is loaded
          await reload(u);

          const ref = doc(db, "users", u.uid);
          const snap = await getDoc(ref);
          const fsData = snap.exists() ? snap.data() : {};

          // IMPORTANT: Auth (u) overrides Firestore fsData
          setUser({
            ...fsData,
            ...u,
            photoURL: u.photoURL, // ensure new Cloudinary URL wins
          });
        } else {
          setUser(null);
        }
      });

      return () => unsub();
    };

    setup();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
