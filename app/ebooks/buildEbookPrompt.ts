type EbookPromptProps = {
  title: string;
  topic: string;
  audience: string;
  tone: string;
  chapters: number;
  depth?: "basic" | "detailed" | "advanced";
  language?: string;
};

export function buildEbookPrompt({
  title,
  topic,
  audience,
  tone,
  chapters,
  depth = "detailed",
  language = "English",
}: EbookPromptProps) {
  return `
You are a senior professional book writer an  editor.

Write a complete, original, plagiarism-free e-book with the following details:

Title: "${title}"
Main Topic: "${topic}"
Target Audience: ${audience}
Tone: ${tone}
Language: ${language}
Depth Level: ${depth}

STRUCTURE RULES (VERY IMPORTANT):
- First, generate a clear Table of Contents.
- Then write the full e-book chapter by chapter.
- Total chapters: ${chapters}
- Each chapter must have:
  • A clear heading
  • Logical flow
  • Simple but engaging language
  • Real-world examples or explanations
  • Smooth transitions between chapters

CONTENT QUALITY RULES:
- Avoid fluff, repetition, and generic filler.
- Do NOT mention that you are an AI.
- Do NOT include meta commentary.
- Maintain consistent tone and voice throughout.
- Ensure content feels human-written and professional.

FORMATTING RULES:
- Use clear headings and subheadings.
- Separate chapters with line breaks.
- Do NOT use markdown symbols like ### or **.
- Do NOT add page numbers or footers.
- Output must be clean plain text, ready for PDF export.

ENGAGEMENT RULES:
- Start with a compelling introduction.
- End with a strong conclusion and next steps.
- Where helpful, include practical tips or actionable advice.

Begin writing the e-book now.
`;
}
