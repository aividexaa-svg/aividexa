import { NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { buildEbookPrompt } from "@/app/ebooks/buildEbookPrompt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      topic,
      audience,
      tone,
      chapters,
      depth,
      language,
    } = body;

    // ✅ Validation
    if (
      !title ||
      !topic ||
      !audience ||
      !tone ||
      !chapters ||
      chapters < 1
    ) {
      return NextResponse.json(
        { error: "Invalid ebook payload" },
        { status: 400 }
      );
    }

    // 🔒 Prompt is built ONLY on backend
    const prompt = buildEbookPrompt({
      title,
      topic,
      audience,
      tone,
      chapters,
      depth,
      language,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 4000, // ebooks need space
    });

    const text =
      completion.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "AI returned empty ebook" },
        { status: 502 }
      );
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Ebook API error:", error);
    return NextResponse.json(
      { error: "Ebook generation failed" },
      { status: 500 }
    );
  }
}
