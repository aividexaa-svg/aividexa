"use client";

import { useState } from "react";

type ScriptWriterFormProps = {
  onUse: (payload: {
    topic: string;
    platform: string;
    tone: string;
    duration: string;
    audience: string;
    style: string;
  }) => void;
};

export default function ScriptWriterForm({ onUse }: ScriptWriterFormProps) {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("YouTube");
  const [tone, setTone] = useState("Engaging");
  const [duration, setDuration] = useState("60 seconds");
  const [audience, setAudience] = useState("General");
  const [style, setStyle] = useState("Storytelling");

  const handleGenerate = () => {
    if (!topic.trim()) return;

    // ✅ SEND DATA ONLY — NO PROMPT
    onUse({
      topic,
      platform,
      tone,
      duration,
      audience,
      style,
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <label className="text-xs text-gray-400">Topic / Idea</label>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What is the script about?"
          className="w-full p-3 rounded-lg bg-black/40 text-white border border-white/10"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 animate-slideUp">
        <Select
          label="Platform"
          value={platform}
          set={setPlatform}
          options={[
            "YouTube",
            "Instagram Reels",
            "Shorts",
            "Ad / Promotion",
            "Speech",
            "Podcast Intro",
          ]}
        />

        <Select
          label="Duration"
          value={duration}
          set={setDuration}
          options={[
            "30 seconds",
            "60 seconds",
            "90 seconds",
            "2–3 minutes",
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 animate-slideUp delay-75">
        <Select
          label="Tone"
          value={tone}
          set={setTone}
          options={[
            "Engaging",
            "Professional",
            "Casual",
            "Motivational",
            "Emotional",
          ]}
        />

        <Select
          label="Audience"
          value={audience}
          set={setAudience}
          options={[
            "General",
            "Students",
            "Creators",
            "Professionals",
          ]}
        />
      </div>

      <Select
        label="Style"
        value={style}
        set={setStyle}
        options={[
          "Storytelling",
          "Educational",
          "Persuasive",
          "Conversational",
          "High-energy",
        ]}
      />

      <button
        onClick={handleGenerate}
        disabled={!topic.trim()}
        className="
          w-full py-4 rounded-xl text-lg font-semibold
          bg-gradient-to-r from-purple-600 to-pink-500
          disabled:opacity-40 transition
          animate-slideUp delay-150
        "
      >
        🎬 Generate Script
      </button>
    </div>
  );
}

/* ================= SELECT ================= */

function Select({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <select
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full mt-1 p-3 rounded-lg bg-black/40 text-white border border-white/10"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#111]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
