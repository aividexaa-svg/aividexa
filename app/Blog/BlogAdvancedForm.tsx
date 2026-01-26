"use client";

import { useState } from "react";

type BlogAdvancedFormProps = {
  onUse: (payload: {
    topic: string;
    blogType: string;
    tone: string;
    audience: string;
    length: string;
    seo: string;
  }) => void;
};

export default function BlogAdvancedForm({ onUse }: BlogAdvancedFormProps) {
  const [topic, setTopic] = useState("");
  const [blogType, setBlogType] = useState("blog");
  const [tone, setTone] = useState("friendly");
  const [audience, setAudience] = useState("general");
  const [length, setLength] = useState("medium");
  const [seo, setSeo] = useState("basic");

  // ✅ kept for UI state (not removed)
  const [loading, setLoading] = useState(false);
  const [result] = useState("");

  const handleGenerate = () => {
    if (!topic.trim()) return;

    setLoading(true);

    // ✅ SEND DATA ONLY — NO PROMPT
    onUse({
      topic,
      blogType,
      tone,
      audience,
      length,
      seo,
    });

    setLoading(false);
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* ================= TOP INPUT ================= */}
      <div className="animate-slideUp">
        <label className="text-sm text-gray-400 mb-1 block">
          Blog Topic
        </label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. How AI is changing office productivity"
          className="
            w-full p-4 rounded-xl
            bg-black/40 text-white
            text-lg
            outline-none
            border border-white/10
            focus:border-green-500/60
          "
        />
      </div>

      {/* ================= STYLE ================= */}
      <div className="grid grid-cols-2 gap-4 animate-slideUp delay-75">
        <Select
          label="Content Type"
          value={blogType}
          onChange={setBlogType}
          options={[
            ["blog", "Blog Post"],
            ["seo", "SEO Article"],
            ["story", "Story-based"],
          ]}
        />

        <Select
          label="Tone"
          value={tone}
          onChange={setTone}
          options={[
            ["friendly", "Friendly"],
            ["professional", "Professional"],
            ["storytelling", "Storytelling"],
          ]}
        />
      </div>

      {/* ================= AUDIENCE + LENGTH ================= */}
      <div className="grid grid-cols-2 gap-4 animate-slideUp delay-100">
        <Select
          label="Audience"
          value={audience}
          onChange={setAudience}
          options={[
            ["general", "General"],
            ["beginners", "Beginners"],
            ["experts", "Experts"],
          ]}
        />

        <Select
          label="Length"
          value={length}
          onChange={setLength}
          options={[
            ["short", "Short"],
            ["medium", "Medium"],
            ["long", "Long"],
          ]}
        />
      </div>

      {/* ================= SEO ================= */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-black/30 border border-white/10 animate-slideUp delay-150">
        <span className="text-sm text-gray-300">SEO Optimization</span>
        <select
          value={seo}
          onChange={(e) => setSeo(e.target.value)}
          className="bg-black/40 text-white px-3 py-2 rounded-lg border border-white/10 outline-none"
        >
          <option value="none">None</option>
          <option value="basic">Basic</option>
          <option value="strong">Strong</option>
        </select>
      </div>

      {/* ================= GENERATE ================= */}
      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="
          w-full py-4 rounded-xl text-lg font-semibold
          bg-gradient-to-r from-green-600 to-emerald-500
          hover:opacity-90 transition
          disabled:opacity-40
          animate-slideUp delay-200
        "
      >
        {loading ? "Generating…" : "✨ Generate Blog"}
      </button>

      {/* ================= RESULT (kept, ChatPage controls it) ================= */}
      {result && (
        <div className="animate-scaleIn space-y-4 pt-2">
          <textarea
            value={result}
            readOnly
            className="
              w-full h-64
              bg-black/40
              text-white
              p-4
              rounded-xl
              border border-white/10
              resize-none
            "
          />

          <button
            onClick={() => onUse(result as any)}
            className="
              w-full py-3 rounded-xl font-semibold
              bg-gradient-to-r from-green-600 to-emerald-500
              hover:opacity-90 transition
            "
          >
            💬 Use in Chat
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL SELECT COMPONENT ================= */

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full mt-1 p-3 rounded-lg
          bg-black/40 text-white
          border border-white/10
          outline-none
        "
      >
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-[#111] text-white">
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
