"use client";

import { useState } from "react";
import BlogAdvancedForm from "@/app/Blog/BlogAdvancedForm";
import EmailWriterForm from "@/app/Email/EmailWriterForm";
import ScriptWriterForm from "@/app/script/ScriptWriterForm";
import ResumeWriterForm from "@/app/resume/ResumeWriterForm";
import EbookWriterForm from "@/app/ebooks/EbookWriterForm";
import SummaryWriterForm from "@/app/Summarizer/SummaryWriterForm"; // ✅ ADD

/* ================= TYPES ================= */

type EmailPayload = {
  platform: string;
  purpose: string;
  tone: string;
  length: string;
  context: string;
};

type BlogPayload = {
  topic: string;
  blogType: string;
  tone: string;
  audience: string;
  length: string;
  seo: string;
};

type ScriptPayload = {
  topic: string;
  platform: string;
  tone: string;
  duration: string;
  audience: string;
  style: string;
};

type ResumePayload = {
  name: string;
  role: string;
  experience: string;
  skills: string;
  education: string;
  tone: string;
  resumeType: string;
};

type EbookPayload = {
  title: string;
  topic: string;
  audience: string;
  tone: string;
  chapters: number;
  depth: "basic" | "detailed" | "advanced";
  bookType: string;
  includeExamples: boolean;
  includeActions: boolean;
  outlineOnly: boolean;
};

type SummaryPayload = {
  content?: string;
  youtubeUrl?: string;
  summaryType: "short" | "detailed" | "bullets" | "study" | "timestamped";
  style: "simple" | "academic" | "exam" | "beginner";
};

type WritingModalProps = {
  isOpen: boolean;
  onClose: () => void;

  onUseEmail: (payload: EmailPayload) => void;
  onUseBlog: (payload: BlogPayload) => void;
  onUseScript: (payload: ScriptPayload) => void;
  onUseResume: (payload: ResumePayload) => void;
  onUseEbook: (payload: EbookPayload) => void;
  onUseSummary: (payload: SummaryPayload) => void; // ✅ ADD
};

export default function WritingModal({
  isOpen,
  onClose,
  onUseEmail,
  onUseBlog,
  onUseScript,
  onUseResume,
  onUseEbook,
  onUseSummary, // ✅ ADD
}: WritingModalProps) {
  const [mode, setMode] = useState<
    | "select"
    | "blog"
    | "email"
    | "script"
    | "resume"
    | "ebook"
    | "summary" // ✅ ADD
  >("select");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#111] border border-white/10 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white">Writing Assistant</h2>
            <p className="text-sm text-gray-400 mt-1">
              Choose a writing mode
            </p>
          </div>

          <button
            onClick={() => {
              setMode("select");
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/80 transition"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8 max-h-[75vh] overflow-y-auto">

          {/* SELECT MODE */}
          {mode === "select" && (
            <div className="grid grid-cols-2 gap-5">
              <ModeButton icon="📝" title="Blog Writer" onClick={() => setMode("blog")} />
              <ModeButton icon="📧" title="Email Writer" onClick={() => setMode("email")} />
              <ModeButton icon="🎬" title="Script Writer" onClick={() => setMode("script")} />
              <ModeButton icon="📄" title="Resume Builder" onClick={() => setMode("resume")} />
              <ModeButton icon="📘" title="E-Book Creator" onClick={() => setMode("ebook")} />
              <ModeButton icon="📚" title="Lecture & Video Summarizer" onClick={() => setMode("summary")} /> {/* ✅ ADD */}
            </div>
          )}

          {/* BACK BUTTON */}
          {mode !== "select" && (
            <button
              onClick={() => setMode("select")}
              className="mb-4 text-sm text-gray-400 hover:text-white"
            >
              ← Back
            </button>
          )}

          {/* BLOG */}
          {mode === "blog" && (
            <BlogAdvancedForm
              onUse={(payload) => {
                onUseBlog(payload);
                setMode("select");
                onClose();
              }}
            />
          )}

          {/* EMAIL */}
          {mode === "email" && (
            <EmailWriterForm
              onUse={(payload) => {
                onUseEmail(payload);
                setMode("select");
                onClose();
              }}
            />
          )}

          {/* SCRIPT */}
          {mode === "script" && (
            <ScriptWriterForm
              onUse={(payload) => {
                onUseScript(payload);
                setMode("select");
                onClose();
              }}
            />
          )}

          {/* RESUME */}
          {mode === "resume" && (
            <ResumeWriterForm
              onUse={(payload) => {
                onUseResume(payload);
                setMode("select");
                onClose();
              }}
            />
          )}

          {/* EBOOK */}
          {mode === "ebook" && (
            <EbookWriterForm
              onUse={(payload) => {
                onUseEbook(payload);
                setMode("select");
                onClose();
              }}
            />
          )}

          {/* SUMMARY */}
          {mode === "summary" && (
            <SummaryWriterForm
              onUse={(payload) => {
                onUseSummary(payload);
                setMode("select");
                onClose();
              }}
            />
          )}

        </div>

        <div className="text-center text-xs text-gray-500 py-3 border-t border-white/10">
          Powered by AI
        </div>
      </div>
    </div>
  );
}

/* ================= MODE BUTTON ================= */

function ModeButton({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </button>
  );
}
