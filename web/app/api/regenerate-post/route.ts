import { NextResponse } from "next/server";
import { regeneratePost } from "@/lib/regenerate-post";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { topic, tone, channel } = (await req.json()) as {
      topic?: string;
      tone?: string;
      channel?: string;
    };
    if (!topic?.trim()) {
      return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }
    const post = await regeneratePost(topic.trim(), tone ?? "", channel ?? "LinkedIn");
    if (!post) {
      return NextResponse.json(
        { error: "no_provider", message: "Add a funded LLM key to regenerate posts." },
        { status: 503 },
      );
    }
    return NextResponse.json(post);
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
