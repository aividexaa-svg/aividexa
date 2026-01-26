import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { buildSummaryPrompt } from "@/app/Summarizer/summaryPrompt";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

/* ================= API ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { content, summaryType, style } = body;

    // 🔒 TEXT ONLY VALIDATION
    if (!content || !summaryType || !style) {
      return NextResponse.json(
        { error: "Invalid summary payload. Please paste text content." },
        { status: 400 }
      );
    }

    const inputText = content.trim();

    if (!inputText || inputText.length < 30) {
      return NextResponse.json(
        { error: "Please paste at least 30 characters of text." },
        { status: 400 }
      );
    }

    // 🔒 PROMPT BUILT ONLY ON BACKEND
    const prompt = buildSummaryPrompt({
      content: inputText,
      summaryType,
      style,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 1100,
    });

    const text = completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });

  } catch (err: any) {
    console.error("Summary API error:", err.message || err);

    return NextResponse.json(
      { error: "Summary generation failed" },
      { status: 500 }
    );
  }
}
