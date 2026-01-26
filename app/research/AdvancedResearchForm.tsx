"use client";

import { useState } from "react";

export default function AdvancedResearchForm({
  onGenerate,
  onBack,
}: {
 onGenerate: (data: {
    subject: string;
    researchQuestion: string;
    depth: "Basic" | "Intermediate" | "Advanced";
    words: string;
    methodology: string;
    citations: string;
    references: string;
    plagiarismShield: "Low" | "Medium" | "High" | "Extreme";
    criticalThinking: boolean;
  }) => void;  onBack: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [researchQuestion, setResearchQuestion] = useState("");

  const [depth, setDepth] =
    useState<"Basic" | "Intermediate" | "Advanced">("Advanced");

  const [words, setWords] = useState("2000");
  const [methodology, setMethodology] = useState("Theoretical");
  const [citations, setCitations] = useState("APA");
  const [references, setReferences] = useState("8");

  const [plagiarismShield, setPlagiarismShield] = useState(true);

  const generate = () => {
    onGenerate({
      subject,
      researchQuestion,
      depth,
      words,
      methodology,
      citations,
      references,
      plagiarismShield: plagiarismShield ? "High" : "Medium",
      criticalThinking: true,
    });
  };


  return (
    <div className="space-y-6 animate-advancedEnter">

      {/* HEADER — SAME AS ASSIGNMENT */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Advanced Research
        </h2>

        <button
          onClick={onBack}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          ← Back
        </button>
      </div>

      {/* CORE INPUTS */}
      <Input label="Subject" value={subject} setValue={setSubject} />
      <Input
        label="Research Topic / Question"
        value={researchQuestion}
        setValue={setResearchQuestion}
      />

      {/* RESEARCH SETTINGS */}
      <Section title="Research Settings">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Depth Level"
            value={depth}
            setValue={setDepth}
            options={["Basic", "Intermediate", "Advanced"]}
          />

          <Select
            label="Methodology"
            value={methodology}
            setValue={setMethodology}
            options={["Qualitative", "Quantitative", "Mixed", "Theoretical"]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Word Count"
            value={words}
            setValue={setWords}
            options={["1500", "2000", "3000"]}
          />

          <Select
            label="Citation Style"
            value={citations}
            setValue={setCitations}
            options={["APA", "MLA", "Chicago"]}
          />
        </div>

        <Select
          label="Number of References"
          value={references}
          setValue={setReferences}
          options={["5", "8", "12"]}
        />
      </Section>

      {/* ORIGINALITY / PLAGIARISM TOGGLE — SAME STRUCTURE */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium">Critical & Original Research</p>
          <p className="text-[11px] text-gray-400">
            Examiner-safe, plagiarism-controlled writing
          </p>
        </div>

        <button
          onClick={() => setPlagiarismShield(!plagiarismShield)}
          className={`relative w-11 h-6 rounded-full transition
            ${plagiarismShield ? "bg-blue-600" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all
              ${plagiarismShield ? "left-5" : "left-1"}`}
          />
        </button>
      </div>

      {/* ACTIONS — SAME AS ASSIGNMENT */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-white/10 rounded-lg text-sm"
        >
          Back
        </button>

        <button
          disabled={!subject || !researchQuestion}
          onClick={generate}
          className="
            px-5 py-2 rounded-lg text-sm font-semibold
            bg-gradient-to-r from-blue-600 to-cyan-600
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

/* ========== HELPERS (IDENTICAL TO ASSIGNMENT) ========== */

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
        focus:ring-2 focus:ring-blue-500/40
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
        focus:ring-2 focus:ring-blue-500/40
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
