import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { buildResumePrompt } from "@/app/resume/buildResumePrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      role,
      experience,
      skills,
      education,
      tone,
      resumeType,
    } = body;

    if (
      !name ||
      !role ||
      !experience ||
      !skills ||
      !education ||
      !tone ||
      !resumeType
    ) {
      return NextResponse.json(
        { error: "Invalid resume payload" },
        { status: 400 }
      );
    }

    // 🔒 Prompt created ONLY on backend
    const prompt = buildResumePrompt({
      name,
      role,
      experience,
      skills,
      education,
      tone,
      resumeType,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1400,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty resume" },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Resume API error:", err);
    return NextResponse.json(
      { error: "Resume generation failed" },
      { status: 500 }
    );
  }
}
