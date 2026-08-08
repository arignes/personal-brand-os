import { NextResponse } from "next/server";
import { generateImage, geminiImageAvailable } from "@/lib/image-gen";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!geminiImageAvailable()) {
    return NextResponse.json(
      { error: "no_key", message: "Add GEMINI_API_KEY to web/.env.local for image generation." },
      { status: 503 },
    );
  }
  try {
    const { prompt } = (await req.json()) as { prompt?: string };
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
    const image = await generateImage(prompt.trim());
    return NextResponse.json({ image });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: "gen_failed", message }, { status: 502 });
  }
}
