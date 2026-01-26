type ScriptPromptProps = {
  topic: string;
  platform: string;
  tone: string;
  duration: string;
  audience: string;
  style: string;
};

export function buildScriptPrompt({
  topic,
  platform,
  tone,
  duration,
  audience,
  style,
}: ScriptPromptProps) {
  return `
You are a senior professional scriptwriter who writes scripts that feel
100% human, emotionally engaging, and original.

Your task is to write a ${duration} script specifically for ${platform}.

━━━━━━━━━━━━━━━━━━
CONTEXT
━━━━━━━━━━━━━━━━━━
Topic:
"${topic}"

Target Audience:
${audience}

Tone:
${tone}

Writing Style:
${style}

━━━━━━━━━━━━━━━━━━
CORE OBJECTIVE
━━━━━━━━━━━━━━━━━━
The script must:
- Instantly grab attention within the first 3 seconds
- Keep the audience engaged till the final line
- Sound natural, confident, and human-written
- Feel original and non-repetitive
- Avoid anything that sounds robotic, generic, or AI-generated

━━━━━━━━━━━━━━━━━━
STRICT WRITING RULES
━━━━━━━━━━━━━━━━━━
- DO NOT mention AI, generation, or prompts
- DO NOT use filler phrases like:
  "In this video", "Let’s talk about", "Today we will"
- DO NOT over-explain
- DO NOT sound like an essay
- Use short, clear, punchy sentences
- Write as a real human speaking to another human
- Use natural pauses, emphasis, and rhythm where needed
- Avoid emojis unless the platform absolutely requires it
- No hashtags unless platform-specific (like Reels)

━━━━━━━━━━━━━━━━━━
SCRIPT STRUCTURE
━━━━━━━━━━━━━━━━━━
1. HOOK (first 2–3 lines)
   - Create curiosity, shock, emotion, or relatability
   - Make the viewer want to keep watching

2. MAIN BODY
   - Deliver the core message clearly
   - Use examples, contrasts, or storytelling if suitable
   - Maintain conversational flow
   - Keep energy consistent with platform

3. CLOSING / CTA
   - End with a strong closing line
   - Can be a question, insight, or subtle call-to-action
   - Must feel natural, not salesy

━━━━━━━━━━━━━━━━━━
QUALITY CHECK (INTERNAL)
━━━━━━━━━━━━━━━━━━
Before finalizing, ensure:
- It does NOT sound like AI
- A real creator could confidently read this aloud
- The pacing fits ${duration}
- Language matches ${platform} expectations
- Audience (${audience}) would genuinely relate

Now write the final script only.
Do not add explanations or formatting notes.
`;
}
