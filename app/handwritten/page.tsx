"use client";

import { useState, useEffect } from "react";

export default function HandwrittenExportModal({
  isOpen,
  onClose,
  defaultText,
  onDownload,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultText: string;
  onDownload: (text: string, preview?: boolean) => Promise<void>;
}) {

  /* ================= STATES ================= */
  const [mode, setMode] = useState<"text" | "qa">("text");

  const [text, setText] = useState(defaultText || "");
  const [fontSize, setFontSize] = useState("14");
  const [inkColor, setInkColor] = useState("blue");
  const [fontFamily, setFontFamily] = useState("kalam");
  const [pageStyle, setPageStyle] = useState("lined");
  const [margin, setMargin] = useState("60");
  const [questionColor, setQuestionColor] = useState("blue");

  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* ================= ESC KEY CLOSE ================= */
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (previewUrl) setPreviewUrl(null);
        else onClose();
      }
    };

    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, previewUrl, onClose]);

  /* ================= SPELLING FIX ================= */
  const spellingFixes: Record<string, string> = {
    teh: "the",
    whre: "where",
    definately: "definitely",
    recieve: "receive",
    "ans ": "Ans ",
    q: "Q",
  };

  const handleCheckFix = () => {
    let fixedText = text;
    Object.entries(spellingFixes).forEach(([wrong, correct]) => {
      fixedText = fixedText.replace(new RegExp(wrong, "gi"), correct);
    });
    setText(fixedText);
  };

  /* ================= PREVIEW ================= */
  const handlePreview = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await onDownload(text, true); // ✅ PREVIEW MODE
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ================= */
  const handleDownload = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      await onDownload(text, false); // ✅ FINAL DOWNLOAD
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ================= MAIN MODAL ================= */}
      <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
       <div className="
  w-full max-w-3xl
  bg-[#0F0F11]
  text-white
  border border-white/10
  rounded-2xl shadow-2xl
  p-6
  animate-fadeIn
">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
  <div className="flex flex-col gap-1">
    <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
      Handwritten PDF
    </h2>

    {/* 🔒 Preview watermark badge */}
    <span
      className="
        inline-flex w-fit
        px-2.5 py-0.5
        rounded-full text-[11px] font-medium
        bg-yellow-500/15 text-yellow-300
        border border-yellow-400/20
      "
    >
      🔒 Preview has watermark
    </span>
  </div>

  <button
    onClick={onClose}
    className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/80 transition"
  >
    ✕
  </button>
</div>


          {/* MODE TOGGLE */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode("text")}
              className={`flex-1 py-2 rounded-lg text-sm ${
                mode === "text"
                  ? "bg-blue-600"
                  : "bg-white/bg-gray-200 text-white hover:bg-gray-300dark:bg-white/10 dark:text-white dark:hover:bg-white/20hover:bg-white/20"
              }`}
            >
              ✍ Normal Writing
            </button>
            <button
              onClick={() => setMode("qa")}
              className={`flex-1 py-2 rounded-lg text-sm ${
                mode === "qa"
                  ? "bg-purple-600"
                  : "bg-white/bg-gray-200 text-white hover:bg-gray-300dark:bg-white/10 dark:text-white dark:hover:bg-white/20hover:bg-white/20"
              }`}
            >
              ❓ Q & A
            </button>
          </div>

          {/* TEXTAREA */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === "qa"
                ? `Q1. What is AI?\nAns: AI is a branch of CS\n\nQ2. Explain types\nAns:`
                : "Write or paste your content…"
            }

  className="
    w-full h-48 
    bg-black/40
    text-white
    placeholder:text-gray-400
    rounded-xl
    px-4 py-3
    text-sm
    resize-none
    outline-none
    mb-5
  "
/>

          

          {/* OPTIONS */}
          <div className="grid grid-cols-2 gap-4 mb-5 items-end">
            <Select label="Font Size" value={fontSize} set={setFontSize} options={["12", "14", "16", "18"]} />
            <Select label="Ink Color" value={inkColor} set={setInkColor} options={["blue", "black"]} />
            <Select label="Font Style" value={fontFamily} set={setFontFamily} options={[
              ["kalam", "Kalam"],
              ["caveat", "Caveat"],
              ["patrick", "Patrick Hand"],
            ]} />
            <Select label="Page Style" value={pageStyle} set={setPageStyle} options={[
              ["lined", "Ruled"],
              ["plain", "Plain"],
            ]} />
            <Select label="Margin" value={margin} set={setMargin} options={["40", "60", "80", "100"]} />

            {mode === "qa" && (
              <Select
                label="Question Color"
                value={questionColor}
                set={setQuestionColor}
                options={[
                  ["blue", "Blue"],
                  ["black", "Black"],
                  ["purple", "Purple"],
                  ["red", "Red"],
                  ["green", "Green"],
                ]}
              />
            )}
          </div>

          {/* ACTIONS */}
          <button
            onClick={handleCheckFix}
            className="w-full mb-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
          >
            ✅ Check & Fix
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              disabled={loading}
className=" flex-1 py-3 rounded-xl transition bg-gray-200 text-black hover:bg-gray-300 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 "
            >
              👁 Preview
            </button>

            <button
              onClick={handleDownload}
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 disabled:opacity-40"
            >
              {loading ? "Generating…" : "Download PDF"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= SELECT COMPONENT ================= */

function Select({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: (string | [string, string])[];
}) {
  return (
    <div>
      <label className="text-xs text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
className="
    w-full
    bg-black/40
    text-white
    rounded-lg
    px-3 py-2
    text-sm
    outline-none
  "
>        {options.map((o) => (
          <option
            key={Array.isArray(o) ? o[0] : o}
            value={Array.isArray(o) ? o[0] : o}
            className="bg-black text-white dark:bg-[#111] dark:text-white"
          >
            {Array.isArray(o) ? o[1] : o}
          </option>
        ))}
      </select>
    </div>
  );
}
