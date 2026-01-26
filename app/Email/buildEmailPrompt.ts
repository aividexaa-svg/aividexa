type EmailPromptProps = {
  platform: string;
  purpose: string;
  tone: string;
  length: string;
  context: string;
};

export function buildEmailPrompt({
  platform,
  purpose,
  tone,
  length,
  context,
}: EmailPromptProps) {
  return `
You are a real person writing a ${platform} message.

Write a ${length} ${platform.toLowerCase()} for the following purpose:
"${purpose}"

WRITING CONTEXT:
${context}

STYLE RULES:
- Sound natural and human, not robotic
- Keep sentences clear and realistic
- Do NOT sound like a template
- Avoid filler phrases like "I hope this message finds you well"
- Maintain a ${tone} tone
- Do NOT mention AI or automation
- Write exactly how a real person would send it

STRUCTURE:
- Clear opening
- Main message
- Polite and natural closing

FINAL CHECK:
- The message must feel handwritten, not generated
- Should be ready to send without edits

Now write the message.
`;
}
