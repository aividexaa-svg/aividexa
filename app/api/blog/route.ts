import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { buildAdvancedBlogPrompt } from "@/app/Blog/buildAdvancedBlogPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      topic,
      blogType,
      tone,
      audience,
      length,
      seo,
    } = body;

    // ✅ Validation
    if (!topic || !blogType || !tone || !audience || !length) {
      return NextResponse.json(
        { error: "Invalid blog payload" },
        { status: 400 }
      );
    }

    // 🔒 Prompt built ONLY on backend
    const prompt = buildAdvancedBlogPrompt({
      topic,
      blogType,
      tone,
      audience,
      length,
      seo,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 1600,
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
    console.error("Blog API error:", error);
    return NextResponse.json(
      { error: "Blog generation failed" },
      { status: 500 }
    );
  }
}
