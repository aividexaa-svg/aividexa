"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/contextAuth/AuthContext";

type Mode = "home" | "report" | "feedback";

export default function HelpModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();

  const [mode, setMode] = useState<Mode>("home");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // ESC close
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const submit = async () => {
    if (!text.trim() || !user) return;

    setLoading(true);

    await addDoc(
      collection(db, mode === "report" ? "reports" : "feedback"),
      {
        userId: user.uid,
        message: text.trim(),
        createdAt: serverTimestamp(),
      }
    );

    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      setText("");
      setMode("home");
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md">

      {/* Glow */}
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full animate-pulse" />

      <div className="relative w-full max-w-md bg-[#0F0F11] border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.35)] p-6 animate-scaleIn">

        {/* Header */}
       <div className="flex justify-between items-center mb-5">
  <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
    {mode === "home"
      ? "Help & Support"
      : mode === "report"
      ? "Report a Problem"
      : "Send Feedback"}
  </h2>

  {/* Close button ONLY on home */}
  {mode === "home" && (
    <button
      onClick={onClose}
      className="
        text-white/60
        hover:text-white
        transition
        text-lg
        leading-none
      "
      aria-label="Close help"
    >
      ✕
    </button>
  )}
</div>

        {/* Success */}
        {success && (
          <div className="py-10 text-center text-green-400 text-sm">
            ✓ Submitted successfully
          </div>
        )}

        {/* Home */}
        {!success && mode === "home" && (
          <div className="space-y-2 text-sm">
           <button
  onClick={() => {
    onClose();
    window.location.href = "/help";
  }}
  className="
    flex items-center gap-3
    px-4 py-3
    rounded-xl
    bg-white/5
    hover:bg-white/10
    transition
    text-left
    w-full
  "
>
  <span className="text-lg">📘</span>
  <div>
    <p className="font-medium">Help Center</p>
    <p className="text-[11px] text-gray-400">
      Guides, FAQs & documentation
    </p>
  </div>
</button>


            <button
              onClick={() => setMode("report")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left"
            >
              <span className="text-lg">🐞</span>
              <div>
                <p className="font-medium">Report a Problem</p>
                <p className="text-[11px] text-gray-400">
                  Something not working?
                </p>
              </div>
            </button>

            <button
              onClick={() => setMode("feedback")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left"
            >
              <span className="text-lg">💬</span>
              <div>
                <p className="font-medium">Send Feedback</p>
                <p className="text-[11px] text-gray-400">
                  Share ideas or suggestions
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Form */}
        {!success && mode !== "home" && (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === "report"
                  ? "Describe the issue you faced…"
                  : "Share your feedback or idea…"
              }
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setMode("home")}
                className="px-4 py-2 rounded-lg bg-white/10"
              >
                Back
              </button>

              <button
                onClick={submit}
                disabled={loading || !text.trim()}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold disabled:opacity-40"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
