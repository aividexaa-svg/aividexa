"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import TermsCheckbox from "../components/TermsCheckbox";

import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

/* 🔐 FEATURE TOGGLE (CHANGE TO true TO RE-ENABLE EMAIL SIGNUP LATER) */
const EMAIL_SIGNUP_ENABLED = false;

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= HELPERS ================= */

  const ensureTermsAccepted = () => {
    if (!acceptedTerms) {
      alert("You must accept the Terms & Privacy Policy to continue.");
      return false;
    }
    return true;
  };

  /* ================= SIGNUP METHODS ================= */

  // 🔐 Google Signup (PRIMARY)
  const signupWithGoogle = async () => {
    if (!ensureTermsAccepted()) return;

    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        name: res.user.displayName || "",
        photoURL: res.user.photoURL || "",
        plan: "free",
        provider: "google",
        termsAccepted: true,
        termsAcceptedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setTimeout(() => router.push("/chat"), 1200);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  // 🔐 Email Signup (DISABLED, BUT LOGIC KEPT)
  const signupWithEmail = async () => {
    if (!EMAIL_SIGNUP_ENABLED) {
      setErrorMsg("Email & password signup is currently disabled. Please continue with Google.");
      return;
    }

    if (!ensureTermsAccepted()) return;

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(res.user, {
        url: "http://localhost:3000/login",
        handleCodeInApp: false,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        email: res.user.email,
        name: "",
        photoURL: "",
        plan: "free",
        provider: "email",
        emailVerified: false,
        termsAccepted: true,
        termsAcceptedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      await signOut(auth);
      setSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">

      {/* Glow blobs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-3xl rounded-full top-[-150px] left-[-100px]" />
      <div className="absolute w-[450px] h-[450px] bg-blue-600/30 blur-3xl rounded-full bottom-[-150px] right-[-100px]" />

      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 text-white/80 border border-white/20 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white/10 transition"
      >
        ⬅ Back
      </button>

      {/* Success Overlay */}
      {success && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-20">
          <div className="bg-white text-center text-gray-800 rounded-2xl p-8 shadow-2xl w-80">
            <h2 className="text-xl font-bold mb-3">Account Created 🎉</h2>
            <p className="text-sm mb-4">
              You’re all set! Continue using AI Videxa.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="w-full py-2 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Card */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account ✨
        </h1>

        {errorMsg && (
          <p className="text-sm text-red-400 text-center mb-3">{errorMsg}</p>
        )}

        {/* Google */}
        <button
          onClick={signupWithGoogle}
          className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          Continue with Google
        </button>

        <div className="text-center text-sm text-gray-300 my-4">or</div>

        {/* Email (Disabled but visible) */}
        <input
          type="email"
          placeholder="Email (disabled)"
          disabled
          className="w-full px-4 py-3 mb-3 bg-gray-800/40 rounded-xl border border-white/10 text-gray-400 cursor-not-allowed"
        />

        <input
          type="password"
          placeholder="Password (disabled)"
          disabled
          className="w-full px-4 py-3 mb-4 bg-gray-800/40 rounded-xl border border-white/10 text-gray-400 cursor-not-allowed"
        />

        {/* Terms */}
        <div className="mb-4">
          <TermsCheckbox
            checked={acceptedTerms}
            onChange={setAcceptedTerms}
            required
          />
        </div>

        {/* Disabled Email Button */}
        <button
          onClick={signupWithEmail}
          disabled
          className="w-full py-3 rounded-xl bg-gray-600 font-semibold cursor-not-allowed opacity-70"
        >
          Please continue with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Email & password signup is temporarily disabled for security reasons.
        </p>

        <p className="text-center text-gray-300 mt-6 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
