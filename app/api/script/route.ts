import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { buildScriptPrompt } from "@/app/script/buildScriptPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      topic,
      platform,
      tone,
      duration,
      audience,
      style,
    } = body;

    // ✅ Validation
    if (
      !topic ||
      !platform ||
      !tone ||
      !duration ||
      !audience ||
      !style
    ) {
      return NextResponse.json(
        { error: "Invalid script payload" },
        { status: 400 }
      );
    }

    // 🔒 Prompt created ONLY on backend
    const prompt = buildScriptPrompt({
      topic,
      platform,
      tone,
      duration,
      audience,
      style,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Script API error:", error);
    return NextResponse.json(
      { error: "Script generation failed" },
      { status: 500 }
    );
  }
}
