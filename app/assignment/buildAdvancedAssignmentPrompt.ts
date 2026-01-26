export function buildAdvancedAssignmentPrompt({
  subject,
  topic,
  words,
  marks,
  tone,
  citations,
  references,
  plagiarismSafe,
}: {
  subject: string;
  topic: string;
  words: string;
  marks: string;
  tone: string;
  citations: string;
  references: string;
  plagiarismSafe?: boolean;
}) {
  return `
You are writing a high-scoring university-level academic assignment.

TASK:
Write a ${words}-word academic assignment on the topic:
"${topic}"
for the subject "${subject}".

This assignment should be written to meet the expectations of a ${marks}-marks answer
as evaluated by university examiners.

WRITING STYLE & TONE:
- Tone: ${tone}
- Formal, academic, and student-written language
- Clear explanations with logical flow
- Avoid exaggerated or artificial language
- Do NOT mention AI, tools, or prompts

STRUCTURE (STRICTLY FOLLOW THIS ORDER):

1. Title
   - Clear, concise, and academically appropriate

2. Introduction
   - Introduce the topic with background context
   - Explain its relevance to the subject
   - Clearly state the objectives of the assignment

3. Core Concepts and Theoretical Background
   - Explain key terms and concepts in detail
   - Demonstrate conceptual clarity
   - Use subject-appropriate terminology

4. Critical Analysis and Discussion
   - Analyze ideas rather than only describing them
   - Discuss implications, advantages, and limitations
   - Show depth suitable for a ${marks}-marks answer
   - Maintain academic reasoning throughout

5. Examples and Applications
   - Include relevant real-world or practical examples
   - Link examples clearly to theoretical concepts

6. Conclusion
   - Summarize key arguments discussed
   - Reinforce the importance of the topic
   - Avoid introducing new points

7. References
   - Include ${references} academic references
   - Format references using ${citations} style
   - Ensure references appear realistic and academic

DEPTH & MARKING CRITERIA:
- Content should reflect the depth, clarity, and structure expected for a ${marks}-marks answer
- Paragraphs should be well-developed, not overly short
- Logical progression between sections is essential

ORIGINALITY & ACADEMIC INTEGRITY:
${
  plagiarismSafe
    ? `
- Use original, natural phrasing similar to human-written assignments
- Avoid repetitive sentence structures and common AI-style expressions
- Vary sentence length and writing patterns naturally
`
    : ""
}

FINAL INSTRUCTIONS:
- Write in complete paragraph form (not bullet points)
- Ensure the assignment appears ready for direct submission
- The writing should feel student-authored, not machine-generated
`;
}
