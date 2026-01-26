"use client";

import { useState } from "react";

type EmailWriterFormProps = {
  onUse: (payload: {
    platform: string;
    purpose: string;
    tone: string;
    length: string;
    context: string;
  }) => void;
};

export default function EmailWriterForm({ onUse }: EmailWriterFormProps) {
  const [platform, setPlatform] = useState("Email");
  const [purpose, setPurpose] = useState("Request");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Short");
  const [context, setContext] = useState("");

  const handleGenerate = () => {
    if (!context.trim()) return;

    // ✅ SEND ONLY DATA — NOT PROMPT
    onUse({
      platform,
      purpose,
      tone,
      length,
      context,
    });
  };

  return (
    <div className="animate-fadeIn space-y-6">
      {/* PLATFORM + PURPOSE */}
      <div className="grid grid-cols-2 gap-4 animate-slideUp">
        <Select
          label="Platform"
          value={platform}
          set={setPlatform}
          options={["Email", "WhatsApp", "LinkedIn", "SMS"]}
        />

        <Select
          label="Purpose"
          value={purpose}
          set={setPurpose}
          options={[
            "Request",
            "Follow-up",
            "Apology",
            "Cold Outreach",
            "Leave Application",
            "Complaint",
          ]}
        />
      </div>

      {/* TONE + LENGTH */}
      <div className="grid grid-cols-2 gap-4 animate-slideUp delay-75">
        <Select
          label="Tone"
          value={tone}
          set={setTone}
          options={["Professional", "Friendly", "Polite", "Firm"]}
        />

        <Select
          label="Length"
          value={length}
          set={setLength}
          options={["Short", "Medium", "Detailed"]}
        />
      </div>

      {/* CONTEXT */}
      <div className="animate-slideUp delay-100">
        <label className="text-xs text-gray-400">Context / Situation</label>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Explain the situation briefly..."
          className="w-full h-32 bg-black/40 text-white p-4 rounded-xl border border-white/10 outline-none"
        />
      </div>

      {/* GENERATE */}
      <button
        onClick={handleGenerate}
        disabled={!context.trim()}
        className="w-full py-4 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 disabled:opacity-40 transition animate-slideUp delay-150"
      >
        ✉️ Generate Message
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
        className="
          w-full mt-1 p-3
          rounded-lg
          bg-black/40 text-white
          border border-white/10
        "
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
