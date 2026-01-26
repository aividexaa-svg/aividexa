import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  // 🔒 If client already aborted
  if (req.signal.aborted) {
    console.log("🛑 Request aborted before start");
    return new Response(null, { status: 499 });
  }

  let body: any;

  try {
    body = await req.json();
  } catch (err) {
    console.warn("⚠️ Failed to parse JSON (likely aborted request)");
    return NextResponse.json(
      { error: "Request aborted" },
      { status: 400 }
    );
  }

  try {
    // ✅ Accept all formats your app uses
    const prompt =
      body.prompt ||
      body.message ||
      body.userText ||
      body.context ||
      body.messages;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt text required" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
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
    console.error("Groq error:", err);

    return NextResponse.json(
      { error: "AI request failed" },
      { status: 500 }
    );
  }
}
