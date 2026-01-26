"use client";

import { useState } from "react";

export default function AssignmentAdvancedForm({
  onGenerate,
  onBack,
}: {
  onGenerate: (data: {
    subject: string;
    topic: string;
    words: string;
    marks: string;
    tone: string;
    citations: string;
    references: string;
    plagiarismSafe: boolean;
  }) => void;
  onBack: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [words, setWords] = useState("1500");
  const [marks, setMarks] = useState("15");
  const [tone, setTone] = useState("Academic");
  const [citations, setCitations] = useState("APA");
  const [references, setReferences] = useState("5");
  const [plagiarismSafe, setPlagiarismSafe] = useState(true);

const generate = () => {
    onGenerate({
      subject,
      topic,
      words,
      marks,
      tone,
      citations,
      references,
      plagiarismSafe,
    });
  };

  return (
    <div className="space-y-6 animate-advancedEnter">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Advanced Assignment
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
      <Input label="Topic" value={topic} setValue={setTopic} />

      {/* ACADEMIC SETTINGS */}
      <Section title="Academic Settings">
        <div className="grid grid-cols-2 gap-4">
          <Select label="Word Count" value={words} setValue={setWords}
            options={["1000", "1500", "2000"]} />

          <Select label="Marks" value={marks} setValue={setMarks}
            options={["10", "15", "20"]} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Tone" value={tone} setValue={setTone}
            options={["Academic", "Formal", "Exam-Oriented"]} />

          <Select label="Citation Style" value={citations} setValue={setCitations}
            options={["APA", "MLA", "Chicago"]} />
        </div>

        <Select
          label="Number of References"
          value={references}
          setValue={setReferences}
          options={["3", "5", "8"]}
        />
      </Section>

      {/* PLAGIARISM TOGGLE */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium">Plagiarism-safe Writing</p>
          <p className="text-[11px] text-gray-400">
            Human-style, submission ready
          </p>
        </div>

        <button
          onClick={() => setPlagiarismSafe(!plagiarismSafe)}
          className={`relative w-11 h-6 rounded-full transition
            ${plagiarismSafe ? "bg-purple-600" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all
              ${plagiarismSafe ? "left-5" : "left-1"}`}
          />
        </button>
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
          disabled={!subject || !topic}
          onClick={generate}
          className="
            px-5 py-2 rounded-lg text-sm font-semibold
            bg-gradient-to-r from-purple-600 to-pink-600
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

/* ========== HELPERS ========== */

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
        focus:ring-2 focus:ring-purple-500/40
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
        focus:ring-2 focus:ring-purple-500/40
        outline-none
      "
    >
      {options.map((o: string) => (
        <option
          key={o}
          value={o}
          className="bg-[#0f0f14] text-white"
        >
          {o}
        </option>
      ))}
    </select>
  </div>
);
