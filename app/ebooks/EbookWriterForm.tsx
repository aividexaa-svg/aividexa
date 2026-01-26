"use client";

import { useState } from "react";

const audiences = ["Beginners", "Students", "Creators", "Founders", "General"];

export default function EbookWriterForm({
  onUse,
}: {
  onUse: (payload: {
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
  }) => void;
}) {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [chapters, setChapters] = useState(6);
  const [audience, setAudience] = useState("General");
  const [depth, setDepth] = useState<"basic" | "detailed" | "advanced">(
    "detailed"
  );
  const [bookType, setBookType] = useState("Guide");
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeActions, setIncludeActions] = useState(true);
  const [outlineOnly, setOutlineOnly] = useState(false);

  // ✅ kept for UI consistency (no removal)
  const [loading, setLoading] = useState(false);
  const [output] = useState(""); // output now handled by ChatPage

  const handleGenerate = () => {
    if (!title || !topic) return;

    setLoading(true);

    // ✅ SEND DATA ONLY — NO PROMPT
    onUse({
      title,
      topic,
      audience,
      tone,
      chapters,
      depth,
      bookType,
      includeExamples,
      includeActions,
      outlineOnly,
    });

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h2 className="text-xl font-semibold text-white">
          AI E-Book Creator
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Create structured, ready-to-publish ebooks with AI
        </p>
      </div>

      {/* MAIN CARD */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-6">
        {/* TITLE */}
        <input
          placeholder="E-Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="clean-input text-lg"
        />

        {/* TOPIC */}
        <textarea
          placeholder="What should this ebook help the reader achieve?"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          className="clean-input resize-none"
        />

        {/* AUDIENCE */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Target audience</p>
          <div className="flex flex-wrap gap-2">
            {audiences.map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={`px-3 py-1 rounded-full text-xs border transition
                  ${
                    audience === a
                      ? "bg-white text-black border-white"
                      : "border-white/10 text-gray-400 hover:border-white/30"
                  }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* INLINE CONTROLS */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="clean-select select-dark"
          >
            <option>Professional</option>
            <option>Friendly</option>
            <option>Storytelling</option>
            <option>Academic</option>
          </select>

          <select
            value={bookType}
            onChange={(e) => setBookType(e.target.value)}
            className="clean-select select-dark"
          >
            <option>Guide</option>
            <option>Course</option>
            <option>Lead Magnet</option>
            <option>Study Notes</option>
          </select>
        </div>

        {/* DEPTH */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Writing depth</p>
          <div className="flex gap-2">
            {["basic", "detailed", "advanced"].map((d) => (
              <button
                key={d}
                onClick={() => setDepth(d as any)}
                className={`px-4 py-1 rounded-full text-xs transition
                  ${
                    depth === d
                      ? "bg-emerald-400 text-black"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* CHAPTERS */}
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Chapters</span>
            <span>{chapters}</span>
          </div>
          <input
            type="range"
            min={3}
            max={12}
            value={chapters}
            onChange={(e) => setChapters(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>

        {/* TOGGLES */}
        <div className="space-y-2 text-sm">
          <Toggle
            label="Include real-world examples"
            checked={includeExamples}
            onChange={setIncludeExamples}
          />
          <Toggle
            label="Include action steps"
            checked={includeActions}
            onChange={setIncludeActions}
          />
          <Toggle
            label="Generate outline only"
            checked={outlineOnly}
            onChange={setOutlineOnly}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleGenerate}
        disabled={loading || !title || !topic}
        className="w-full py-3 rounded-xl bg-white text-black font-medium disabled:opacity-40"
      >
        {loading ? "Creating your ebook…" : "Generate E-Book"}
      </button>

      {/* OUTPUT (kept, but now controlled by ChatPage) */}
      {output && (
        <div className="space-y-3">
          <textarea
            value={output}
            readOnly
            className="w-full min-h-[320px] rounded-xl bg-black/40 border border-white/10 p-4 text-white"
          />
          <button
            onClick={() => onUse(output as any)}
            className="w-full py-2 rounded-lg bg-emerald-400 text-black font-medium"
          >
            Use this E-Book
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- TOGGLE ---------- */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
    >
      <span className="text-gray-300">{label}</span>
      <span
        className={`w-10 h-5 rounded-full transition ${
          checked ? "bg-emerald-400" : "bg-gray-600"
        }`}
      />
    </button>
  );
}
