import { NextResponse } from "next/server";
import { generateCarousel } from "@/lib/carousel";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { topic, tone } = (await req.json()) as { topic?: string; tone?: string };
    if (!topic?.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }
    const carousel = await generateCarousel(topic.trim(), tone ?? "");
    return NextResponse.json(carousel);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
