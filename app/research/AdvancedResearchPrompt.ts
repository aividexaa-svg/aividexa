export function buildAdvancedResearchPrompt({
  subject,
  researchQuestion,
  depth,
  words,
  methodology,
  citations,
  references,
  plagiarismShield,
  criticalThinking,
}: {
  subject: string;
  researchQuestion: string;
  depth: "Basic" | "Intermediate" | "Advanced";
  words: string;
  methodology: string;
  citations: string;
  references: string;
  plagiarismShield: "Low" | "Medium" | "High" | "Extreme";
  criticalThinking: boolean;
}) {
  return `
You are acting as a senior academic researcher and subject-matter expert.
The following output must be suitable for academic evaluation and submission.

────────────────────────────
RESEARCH TASK:
────────────────────────────
Generate an in-depth, research-oriented academic response on:

"${researchQuestion}"

Subject Area:
"${subject}"

────────────────────────────
RESEARCH PARAMETERS:
────────────────────────────
- Depth Level: ${depth}
- Target Length: ~${words} words
- Research Methodology: ${methodology}
- Citation Style: ${citations}
- Minimum References: ${references}
- Critical Thinking: ${criticalThinking ? "Required" : "Standard"}

────────────────────────────
WRITING & SCHOLARLY STYLE:
────────────────────────────
- Formal academic tone suitable for higher education
- Analytical and evidence-driven writing
- Clear academic voice with logical progression
- No conversational language or filler content
- Do NOT mention AI, tools, prompts, or generation

────────────────────────────
MANDATORY STRUCTURE (STRICT):
────────────────────────────

1. Abstract / Research Overview  
   - Concise summary of objectives, approach, and key insights  

2. Background and Context  
   - Situate the topic within existing knowledge  
   - Explain significance and relevance  

3. Research Objectives / Questions  
   - Clearly defined aims or guiding questions  

4. Methodology and Research Approach  
   - Justify the chosen methodology  
   - Explain how analysis is conducted  

5. Key Findings / Analysis  
   - Present well-reasoned insights  
   - Support arguments with evidence or logical inference  

6. Critical Discussion  
   ${
     criticalThinking
       ? `- Critically evaluate assumptions, implications, and limitations`
       : `- Discuss findings with balanced academic reasoning`
   }
   - Compare perspectives where relevant  

7. Limitations of the Study  
   - Acknowledge realistic constraints or gaps  

8. Conclusion and Future Scope  
   - Summarize key contributions  
   - Suggest directions for future research  

9. References  
   - Minimum ${references} academic references  
   - Format strictly in ${citations} style  

────────────────────────────
PLAGIARISM SHIELD: ${plagiarismShield}
────────────────────────────
${
  plagiarismShield === "Low"
    ? `
- Standard academic originality
- Clear, conventional scholarly phrasing
`
    : plagiarismShield === "Medium"
    ? `
- Human-like paraphrasing and varied syntax
- Avoid repetitive or formulaic structures
`
    : plagiarismShield === "High"
    ? `
- Strong sentence-level variation
- Avoid common academic clichés and stock phrases
- Reduce AI-identifiable stylistic patterns
- Natural academic imperfections permitted
`
    : `
- Examiner-safe, high-authenticity research writing
- Zero detectable AI-style phrasing
- Highly natural flow with non-repetitive structure
- Avoid over-polished or template-like language
- Writing must feel independently authored by a human researcher
`
}

────────────────────────────
DEPTH & QUALITY ENFORCEMENT:
────────────────────────────
- Depth must match "${depth}" research expectations
- Paragraphs should be conceptually rich and well-developed
- Logical continuity between sections is mandatory
- Avoid superficial summaries or generic claims

────────────────────────────
FINAL INSTRUCTIONS:
────────────────────────────
- Write in formal academic paragraph format
- No bullet points unless academically justified
- Ensure the output is submission-ready
- Prioritize originality, rigor, and clarity throughout

Now begin the research output.
`;
}
