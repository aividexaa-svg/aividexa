"use client";

import { useState } from "react";

type ResumeWriterFormProps = {
  onUse: (payload: {
    name: string;
    role: string;
    experience: string;
    skills: string;
    education: string;
    tone: string;
    resumeType: string;
  }) => void;
};

export default function ResumeWriterForm({ onUse }: ResumeWriterFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Fresher");
  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [tone, setTone] = useState("Professional");
  const [resumeType, setResumeType] = useState("ATS-Optimized");

  const handleGenerate = () => {
    if (!name || !role || !skills) return;

    // ✅ SEND DATA ONLY — NO PROMPT
    onUse({
      name,
      role,
      experience,
      skills,
      education,
      tone,
      resumeType,
    });
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Full Name" value={name} set={setName} />
        <Input label="Target Role" value={role} set={setRole} />
      </div>

      <div className="grid grid-cols-2 gap-4 animate-slideUp">
        <Select
          label="Experience Level"
          value={experience}
          set={setExperience}
          options={["Fresher", "1–3 Years", "3–5 Years", "5+ Years"]}
        />

        <Select
          label="Resume Type"
          value={resumeType}
          set={setResumeType}
          options={["ATS-Optimized", "Professional", "Creative"]}
        />
      </div>

      <Select
        label="Tone"
        value={tone}
        set={setTone}
        options={["Professional", "Confident", "Minimal"]}
      />

      <Textarea
        label="Key Skills (comma-separated)"
        value={skills}
        set={setSkills}
        placeholder="React, Node.js, SQL, Communication"
      />

      <Textarea
        label="Education"
        value={education}
        set={setEducation}
        placeholder="B.Tech in Computer Science, XYZ University"
      />

      <button
        onClick={handleGenerate}
        disabled={!name || !role || !skills}
        className="
          w-full py-4 rounded-xl text-lg font-semibold
          bg-gradient-to-r from-indigo-600 to-purple-600
          disabled:opacity-40 transition
          animate-slideUp delay-150
        "
      >
        📄 Generate Resume
      </button>
    </div>
  );
}

/* ================= UI HELPERS ================= */

function Input({
  label,
  value,
  set,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        className="w-full mt-1 p-3 rounded-lg bg-black/40 text-white border border-white/10"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  set,
  placeholder,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-400">{label}</label>
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
        className="w-full mt-1 h-24 p-3 rounded-lg bg-black/40 text-white border border-white/10"
      />
    </div>
  );
}

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
