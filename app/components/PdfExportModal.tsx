"use client";

import { useState } from "react";

export default function PdfExportModal({
  isOpen,
  onClose,
  onDownload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (data: {
    title: string;
    subject: string;
    text: string;
    includeTitle: boolean;
    pageNumbers: boolean;
  }) => void;
}) {
  const [title, setTitle] = useState("Academic Assignment");
  const [subject, setSubject] = useState("General");
  const [text, setText] = useState("");
  const [includeTitle, setIncludeTitle] = useState(true);
  const [pageNumbers, setPageNumbers] = useState(true);

  if (!isOpen) return null;

  const canDownload = text.trim().length > 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl p-6 animate-fadeIn">

        {/* Header */}
        <h2 className="text-lg font-semibold text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
          Export as PDF
        </h2>

        {/* Form */}
        <div className="mt-5 space-y-4 text-sm">

          {/* Title */}
          <div>
            <label className="text-xs text-gray-400">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 bg-white/10 px-3 py-2 rounded-lg outline-none text-white"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="text-xs text-gray-400">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full mt-1 bg-white/10 px-3 py-2 rounded-lg outline-none text-white"
            />
          </div>

          {/* TEXT INPUT */}
          <div>
            <label className="text-xs text-gray-400">
              Content for PDF <span className="text-red-400">*</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the content you want to convert into PDF..."
              rows={6}
              className="
                w-full mt-1 bg-white/10 px-3 py-2 rounded-lg outline-none
                resize-none overflow-y-auto text-white
              "
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-white ">
            <span>Include Title Page</span>
            <input
              type="checkbox"
              checked={includeTitle}
              onChange={() => setIncludeTitle(!includeTitle)}
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <span>Page Numbers</span>
            <input
              type="checkbox"
              checked={pageNumbers}
              onChange={() => setPageNumbers(!pageNumbers)}
            />
          </div>
        </div>  

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6 border-t border-white/10 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Cancel
          </button>

          <button
            disabled={!canDownload}
            onClick={() =>
              onDownload({
                title,
                subject,
                text,
                includeTitle,
                pageNumbers,
              })
            }
            className={`
              px-4 py-2 rounded-lg font-semibold transition
              ${
                canDownload
                  ? "bg-gradient-to-r from-green-600 to-emerald-500"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }
            `}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
