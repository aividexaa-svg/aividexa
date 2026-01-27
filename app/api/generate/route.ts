export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

  return new Groq({ apiKey });
}

export async function POST(req: Request) {
  if (req.signal.aborted) {
    console.log("🛑 Request aborted before start");
    return new Response(null, { status: 499 });
  }

  let body: any;

  try {
    body = await req.json();
  } catch (err) {
    console.warn("⚠️ Failed to parse JSON (likely aborted request)");
    return NextResponse.json({ error: "Request aborted" }, { status: 400 });
  }

  try {
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

    const groq = getGroqClient(); // 🔥 lazy init

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
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
