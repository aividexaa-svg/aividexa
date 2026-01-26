type ResumePromptProps = {
  name: string;
  role: string;
  experience: string;
  skills: string;
  education: string;
  tone: string;
  resumeType: string;
};

export function buildResumePrompt({
  name,
  role,
  experience,
  skills,
  education,
  tone,
  resumeType,
}: ResumePromptProps) {
  return `
You are a senior professional resume writer and career consultant
with deep experience in writing ATS-optimized, recruiter-approved resumes.

Your task is to write a ${resumeType} resume for a real human candidate.

━━━━━━━━━━━━━━━━━━
CANDIDATE PROFILE
━━━━━━━━━━━━━━━━━━
Full Name:
${name}

Target Job Role:
${role}

Experience Level:
${experience}

Education:
${education}

Core Skills:
${skills}

Tone:
${tone}

━━━━━━━━━━━━━━━━━━
PRIMARY OBJECTIVE
━━━━━━━━━━━━━━━━━━
Create a resume that:
- Looks 100% human-written
- Passes ATS (Applicant Tracking Systems)
- Appeals to hiring managers and recruiters
- Highlights real-world impact, not generic duties
- Matches the expectations of the target role (${role})

━━━━━━━━━━━━━━━━━━
STRICT WRITING RULES (VERY IMPORTANT)
━━━━━━━━━━━━━━━━━━
- DO NOT mention AI, tools, prompts, or generation
- DO NOT use clichés like:
  "hardworking", "team player", "results-driven professional"
- DO NOT use long paragraphs
- DO NOT exaggerate beyond realistic professional limits
- Use strong, role-relevant action verbs
- Write concise, achievement-focused bullet points
- Keep language professional, natural, and confident
- No emojis, no tables, no fancy formatting
- Plain text only (ATS-safe)

━━━━━━━━━━━━━━━━━━
STRUCTURE & CONTENT GUIDELINES
━━━━━━━━━━━━━━━━━━

1. PROFESSIONAL SUMMARY (2–3 lines)
   - Clearly state who the candidate is
   - Mention experience level and core expertise
   - Align strongly with the target role
   - No generic introductions

2. KEY SKILLS
   - Bullet points or comma-separated list
   - Include both technical and relevant soft skills
   - Skills must align with the target role

3. WORK EXPERIENCE
   - Write role-appropriate experience
   - Use bullet points only
   - Focus on:
     • Achievements
     • Impact
     • Measurable outcomes (where realistic)
   - Use past tense for previous roles
   - Use present tense for current role
   - Keep bullets short and meaningful

4. EDUCATION
   - Degree, field of study, institution
   - Include graduation year only if relevant

5. OPTIONAL SECTIONS (only if appropriate)
   - Projects
   - Certifications
   - Internships
   - Relevant coursework

━━━━━━━━━━━━━━━━━━
QUALITY CONTROL (INTERNAL CHECK)
━━━━━━━━━━━━━━━━━━
Before finalizing, ensure:
- The resume does NOT sound AI-generated
- A real candidate could confidently submit it
- Content feels tailored to ${role}
- No repeated sentence patterns
- Language fits ${experience} level
- Formatting is clean and ATS-friendly

Now write the complete resume content only.
Do NOT include explanations, headings about prompts, or notes.
`;
}
