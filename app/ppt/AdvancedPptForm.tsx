"use client";

import { useState } from "react";

export default function AdvancedPptForm({
  onGenerate,
  onBack,
}: {
  onGenerate: (data: {
    topic: string;
    slides: string;
    tone: string;
    audience: string;
    visuals: boolean;
    citations: string;
    originalitySafe: boolean;
  }) => void;
  onBack: () => void;
}) {
  const [topic, setTopic] = useState("");
  const [slides, setSlides] = useState("10");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("College Students");
  const [citations, setCitations] = useState("APA");
  const [visuals, setVisuals] = useState(true);
  const [originalitySafe, setOriginalitySafe] = useState(true);

  const generate = () => {
    onGenerate({
      topic,
      slides,
      tone,
      audience,
      visuals,
      citations,
      originalitySafe,
    });
  };

  return (
    <div className="space-y-6 animate-advancedEnter">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          Advanced PPT
        </h2>

        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      {/* CORE INPUT */}
      <Input label="Presentation Topic" value={topic} setValue={setTopic} />

      {/* PPT SETTINGS */}
      <Section title="Presentation Settings">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Number of Slides"
            value={slides}
            setValue={setSlides}
            options={["6", "8", "10", "12", "15"]}
          />

          <Select
            label="Tone"
            value={tone}
            setValue={setTone}
            options={["Professional", "Academic", "Minimal", "Creative"]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Target Audience"
            value={audience}
            setValue={setAudience}
            options={[
              "School Students",
              "College Students",
              "Professionals",
              "General Audience",
            ]}
          />

          <Select
            label="Citation Style"
            value={citations}
            setValue={setCitations}
            options={["APA", "MLA", "Chicago"]}
          />
        </div>
      </Section>

      {/* QUALITY TOGGLES */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium">Visual Suggestions</p>
          <p className="text-[11px] text-gray-400">
            Charts, diagrams & slide visuals
          </p>
        </div>

        <Toggle enabled={visuals} setEnabled={setVisuals} />
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium">Originality-safe Content</p>
          <p className="text-[11px] text-gray-400">
            Human-style, non-generic slides
          </p>
        </div>

        <Toggle enabled={originalitySafe} setEnabled={setOriginalitySafe} />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/10 rounded-lg text-sm"
        >
          Back
        </button>

        <button
          disabled={!topic}
          onClick={generate}
          className="
            px-5 py-2 rounded-lg text-sm font-semibold
            bg-gradient-to-r from-yellow-500 to-orange-500
            hover:scale-105 transition
            disabled:opacity-40
          "
        >
          Generate
        </button>
      </div>
    </div>
  );
}

/* ========== HELPERS (SAME STYLE AS ASSIGNMENT) ========== */

const Section = ({ title, children }: any) => (
  <div className="space-y-3">
    <p className="text-xs uppercase tracking-wider text-gray-400">{title}</p>
    {children}
  </div>
);

const Input = ({ label, value, setValue }: any) => (
  <div>
    <label className="text-xs text-gray-300">{label}</label>
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="
        w-full mt-1 px-3 py-2 rounded-lg
        bg-[#0f0f14] text-white
        border border-white/10
        outline-none
        focus:ring-2 focus:ring-yellow-500/40
      "
    />
  </div>
);

const Select = ({ label, value, setValue, options }: any) => (
  <div className="relative z-50">
    <label className="text-xs text-gray-300">{label}</label>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="
        w-full mt-1 px-3 py-2 rounded-lg
        bg-[#0f0f14] text-white
        border border-white/10
        focus:ring-2 focus:ring-yellow-500/40
        outline-none
      "
    >
      {options.map((o: string) => (
        <option key={o} value={o} className="bg-[#0f0f14] text-white">
          {o}
        </option>
      ))}
    </select>
  </div>
);

const Toggle = ({ enabled, setEnabled }: any) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`relative w-11 h-6 rounded-full transition
      ${enabled ? "bg-yellow-500" : "bg-white/20"}`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all
        ${enabled ? "left-5" : "left-1"}`}
    />
  </button>
);
