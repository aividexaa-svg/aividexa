"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseConfig";
import TermsCheckbox from "../components/TermsCheckbox";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

/* 🔐 FEATURE TOGGLE (set true later if you want email login back) */
const EMAIL_LOGIN_ENABLED = false;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  /* ================= HELPERS ================= */

  const ensureTermsAccepted = () => {
    if (!acceptedTerms) {
      alert("You must accept the Terms & Privacy Policy to continue.");
      return false;
    }
    return true;
  };

  const handleSuccessRedirect = () => {
    setSuccess(true);
    setTimeout(() => router.push("/chat"), 1200);
  };

  /* ================= LOGIN METHODS ================= */

  // ✅ Google login (PRIMARY)
  const loginWithGoogle = async () => {
    if (!ensureTermsAccepted()) return;

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      handleSuccessRedirect();
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  // 🔐 Email login (DISABLED, LOGIC KEPT)
  const loginWithEmail = async () => {
    if (!EMAIL_LOGIN_ENABLED) {
      setErrorMsg("Email & password login is disabled. Please continue with Google.");
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
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);
        await signOut(auth);

        setErrorMsg(
          "Your email is not verified. Please verify your email before logging in."
        );
        return;
      }

      handleSuccessRedirect();
    } catch {
      setErrorMsg("Invalid email or password.");
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur flex items-center justify-center z-20">
          <div className="bg-white text-green-600 rounded-full w-28 h-28 flex items-center justify-center shadow-2xl">
            <span className="text-6xl">✔</span>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="backdrop-blur-2xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-96">

        <h1 className="text-3xl font-bold text-center mb-6">
          Welcome Back 👋
        </h1>

        {errorMsg && (
          <p className="text-sm text-red-400 text-center mb-3">{errorMsg}</p>
        )}

        {/* Google */}
        <button
          onClick={loginWithGoogle}
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
          className="w-full px-4 py-3 mb-3 bg-gray-800/40 rounded-xl border border-white/10 
                     text-gray-400 cursor-not-allowed"
        />

        <input
          type="password"
          placeholder="Password (disabled)"
          disabled
          className="w-full px-4 py-3 mb-4 bg-gray-800/40 rounded-xl border border-white/10 
                     text-gray-400 cursor-not-allowed"
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
          onClick={loginWithEmail}
          disabled
          className="w-full py-3 rounded-xl bg-gray-600 font-semibold cursor-not-allowed opacity-70"
        >
          Please continue with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          Email & password login is temporarily disabled for security reasons.
        </p>

        <p className="text-center text-gray-300 mt-6 text-sm">
          New here?{" "}
          <Link href="/signup" className="text-purple-400 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
