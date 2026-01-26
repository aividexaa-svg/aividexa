import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { buildEmailPrompt } from "@/app/Email/buildEmailPrompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { platform, purpose, tone, length, context } = body;

    if (!context || !purpose) {
      return NextResponse.json(
        { error: "Invalid email payload" },
        { status: 400 }
      );
    }

    // 🔒 PROMPT BUILT ONLY ON BACKEND
    const prompt = buildEmailPrompt({
      platform,
      purpose,
      tone,
      length,
      context,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 700,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json(
      { error: "Email generation failed" },
      { status: 500 }
    );
  }
}
