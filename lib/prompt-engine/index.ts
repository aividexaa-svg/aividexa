import { buildEmailPrompt } from "@/app/Email/buildEmailPrompt";

type PromptPayload = {
  type: "email" | "raw";
  userText?: string;
  purpose?: string;
  tone?: string;
  length?: string;
};

export function buildPrompt(payload: PromptPayload): string {
  // 🔹 EMAIL PROMPT (hidden)
  if (payload.type === "email") {
    return buildEmailPrompt({
      platform: "Email",
      purpose: payload.purpose!,
      tone: payload.tone!,
      length: payload.length!,
      context: payload.userText!,
    });
  }

  // 🔹 RAW PROMPT (fallback)
  return payload.userText || "";
}
