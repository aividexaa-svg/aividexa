"use client";

import { useState } from "react";

/* ================= TYPES ================= */

type SummaryPayload = {
  content: string;
  summaryType: "short" | "detailed" | "bullets" | "study" | "timestamped";
  style: "simple" | "academic" | "exam" | "beginner";
};

export default function SummaryWriterForm({
  onUse,
}: {
  onUse: (payload: SummaryPayload) => void;
}) {
  const [content, setContent] = useState("");
  const [summaryType, setSummaryType] =
    useState<SummaryPayload["summaryType"]>("short");
  const [style, setStyle] =
    useState<SummaryPayload["style"]>("simple");

  const isValid = content.trim().length >= 30;

  return (
    <div className="space-y-5">

      <h3 className="text-xl font-semibold text-white">
        Lecture Summarizer
      </h3>

      {/* TEXT INPUT ONLY */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste lecture text, notes, or transcript (minimum 30 characters)"
        rows={8}
        className="w-full bg-white/10 rounded-lg px-4 py-3 text-white outline-none resize-none"
      />

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Summary Type
          </label>
          <select
            value={summaryType}
            onChange={(e) =>
              setSummaryType(
                e.target.value as SummaryPayload["summaryType"]
              )
            }
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option className="bg-[#111]" value="short">Short</option>
            <option className="bg-[#111]" value="detailed">Detailed</option>
            <option className="bg-[#111]" value="bullets">Bullets</option>
            <option className="bg-[#111]" value="study">Study Notes</option>
            <option className="bg-[#111]" value="timestamped">Timestamped</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Style
          </label>
          <select
            value={style}
            onChange={(e) =>
              setStyle(
                e.target.value as SummaryPayload["style"]
              )
            }
            className="w-full bg-white/10 rounded-lg px-3 py-2 text-white"
          >
            <option className="bg-[#111]" value="simple">Simple</option>
            <option className="bg-[#111]" value="academic">Academic</option>
            <option className="bg-[#111]" value="exam">Exam-Focused</option>
            <option className="bg-[#111]" value="beginner">Beginner-Friendly</option>
          </select>
        </div>

      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() =>
            onUse({
              content: content.trim(),
              summaryType,
              style,
            })
          }
          disabled={!isValid}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-40"
        >
          Generate Summary
        </button>
      </div>

      {!isValid && (
        <p className="text-xs text-gray-400">
          Please paste at least 30 characters of text.
        </p>
      )}

    </div>
  );
}
