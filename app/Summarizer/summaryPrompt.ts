type SummaryPromptParams = {
  content?: string;
  youtubeUrl?: string;
  summaryType: "short" | "detailed" | "bullets" | "study" | "timestamped";
  style: "simple" | "academic" | "exam" | "beginner";
  timestamped?: { time: string; text: string }[];
  language?: string;
};


export function buildSummaryPrompt({
  content,
  youtubeUrl,
  summaryType,
  style,
  timestamped,
  language,
}: SummaryPromptParams): string {

  const baseInstruction = `
You are an expert educational AI assistant.

Your task is to summarize lecture or video content for a student in a clear, structured, and helpful way.

Style preference: ${style}
Primary summary type: ${summaryType}

Follow these rules:
- Use simple, student-friendly language
- Keep explanations concise and accurate
- Highlight important concepts and definitions
- Organize the output with clear headings and bullet points
- Avoid unnecessary filler text
- Do NOT hallucinate timestamps
`;

  // 🔥 REAL timestamped mode
  if (summaryType === "timestamped" && timestamped?.length) {
    const blocks = timestamped
      .map(b => `[${b.time}] ${b.text}`)
      .join("\n");

    return `
${baseInstruction}

Task:
Generate a timestamped summary of the lecture/video.

Rules:
- Use the timestamps exactly as provided
- Group related moments into concise sections
- Do NOT invent new timestamps
- Keep the structure clean and student-friendly

Transcript With Timestamps:
${blocks}

Output Format:
[MM:SS] Topic title  
Short explanation  

[MM:SS] Topic title  
Short explanation  

Return only the timestamped summary.
`;
  }

  // 🔥 Normal summary mode
  const outputFormat = `
Provide the output in the following sections:

1) Short Summary  
(2–3 lines capturing the core idea)

2) Detailed Summary  
(1–2 paragraphs explaining the main points clearly)

3) Key Takeaways  
(Bullet points of important concepts, facts, and ideas)

4) Study Notes  
(Structured notes with headings and short explanations)
`;

  const sourceText = `
Content Source:
${
  youtubeUrl
    ? `YouTube Video URL: ${youtubeUrl}`
    : "Lecture / Text Content Provided Below"
}

Content:
${content}
`;

  return `
${baseInstruction}

${outputFormat}

${sourceText}
`;
}
