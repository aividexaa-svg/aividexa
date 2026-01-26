export function buildAdvancedPptPrompt({
  topic,
  slides,
  tone,
  audience,
  visuals,
  citations,
  originalitySafe,
}: {
  topic: string;
  slides: string;
  tone: string;
  audience: string;
  visuals: boolean;
  citations: string;
  originalitySafe: boolean;
}) {
  const totalSlides = Number(slides);
  const coreEndSlide = Math.max(totalSlides - 3, 3);

  return `
You are creating a professional, high-quality academic PowerPoint presentation
intended for real human presentation.

TASK:
Create a ${totalSlides}-slide PowerPoint presentation on the topic:
"${topic}"

TARGET AUDIENCE:
${audience}

PRESENTATION STYLE:
- Tone: ${tone}
- Clear, concise, professional wording
- Slide-friendly bullet points (not paragraphs)
- Do NOT mention AI, tools, or prompts

────────────────────────────
SLIDE STRUCTURE (STRICT):
────────────────────────────

Slide 1: Title Slide
- Presentation title
- Optional subtitle

Slide 2: Introduction
- Brief background
- Importance of the topic
- Presentation objective

Slides 3–${coreEndSlide}: Core Concepts / Main Content
- One key idea per slide
- Max 5–6 bullet points
- Logical progression of concepts

Next Slide(s): Examples / Case Studies
- Real-world or academic examples
- Short explanations

Next Slide: Key Insights / Analysis
- Important findings or interpretations

Second Last Slide: Conclusion
- Summary of key points
- Final takeaway

Last Slide: References
- Key sources in ${citations} format

────────────────────────────
CHART & DIAGRAM SUGGESTIONS:
────────────────────────────
${
  visuals
    ? `
- DO NOT generate charts, images, or data
- ONLY suggest suitable chart or diagram TYPES

Chart guidance:
• Bar chart – category comparisons
• Pie chart – proportions (use only if meaningful)
• Line chart – trends over time
• Flowchart – processes or workflows
• Timeline – historical development
• Table – exact comparisons (avoid overcrowding)

For each relevant slide:
- Mention chart/diagram type
- Briefly explain why it fits
- Suggest placement (right / below bullets)
`
    : `
- Focus only on textual clarity
- No visual suggestions required
`
}

────────────────────────────
DATA & VISUAL SOURCES:
────────────────────────────
- World Bank, Statista, government portals
- Google Dataset Search, Kaggle
- Wikipedia, Britannica
- Flaticon, Icons8
- Unsplash, Pexels

────────────────────────────
ORIGINALITY & QUALITY:
────────────────────────────
${
  originalitySafe
    ? `
- Use original, non-generic slide text
- Avoid repetitive phrasing
- Ensure professional, human-made output
`
    : ""
}

────────────────────────────
FINAL RULES:
────────────────────────────
- Clearly label each slide (Slide 1, Slide 2, etc.)
- Bullet points only
- Do NOT generate images or charts
- Do NOT invent data
- Output must be ready for PPT creation
`;
}
