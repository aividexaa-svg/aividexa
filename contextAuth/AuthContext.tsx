"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import {
  onAuthStateChanged,
  signOut,
  browserLocalPersistence,
  setPersistence,
  reload,
  User as FirebaseUser,
} from "firebase/auth";
import {
  doc,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

/* ================= TYPES ================= */

interface AuthContextType {
  user: any;              // merged Auth + Firestore
  loading: boolean;       // 🔥 important for gating UI
  logout: () => Promise<void>;
}

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
});

/* ================= PROVIDER ================= */

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let firestoreUnsub: Unsubscribe | null = null;

    const setup = async () => {
      await setPersistence(auth, browserLocalPersistence);

      const authUnsub = onAuthStateChanged(
        auth,
        async (authUser: FirebaseUser | null) => {
          // 🔄 cleanup old snapshot
          if (firestoreUnsub) {
            firestoreUnsub();
            firestoreUnsub = null;
          }

          if (!authUser) {
            setUser(null);
            setLoading(false);
            return;
          }

          // 🔥 ensure latest auth profile
          await reload(authUser);

          const userRef = doc(db, "users", authUser.uid);

          // 🔥 GLOBAL LIVE SNAPSHOT
          firestoreUnsub = onSnapshot(userRef, (snap) => {
            const fsData = snap.exists() ? snap.data() : {};

            // ✅ Auth always wins over Firestore
            setUser({
              ...fsData,
              ...authUser,
              uid: authUser.uid,
              email: authUser.email,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
            });

            setLoading(false);
          });
        }
      );

      return () => {
        authUnsub();
        if (firestoreUnsub) firestoreUnsub();
      };
    };

    setup();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => useContext(AuthContext);
