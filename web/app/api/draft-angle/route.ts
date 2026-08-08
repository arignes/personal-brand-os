import { NextResponse } from "next/server";
import { draftAngle } from "@/lib/agents/draft-angle";
import { anyProviderConfigured } from "@/lib/llm";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!anyProviderConfigured()) {
    return NextResponse.json(
      {
        error: "no_provider",
        message:
          "Add ANTHROPIC_API_KEY (or NOUS_PORTAL_API_KEY) to web/.env.local to generate voice-matched angles.",
      },
      { status: 503 },
    );
  }
  try {
    const body = (await req.json()) as {
      author?: string;
      source?: string;
      text?: string;
      action?: string;
    };
    if (!body.text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const result = await draftAngle({
      author: body.author ?? "",
      source: body.source ?? "web",
      text: body.text,
      action: body.action ?? "REPLY",
    });
    return NextResponse.json(result);
  } catch (e) {
    const raw = e instanceof Error ? e.message : "unknown error";
    let message = "Could not draft an angle. Check the LLM provider key.";
    if (/credit balance is too low/i.test(raw))
      message = "The Anthropic key has no credits. Add credits or set NOUS_PORTAL_API_KEY.";
    else if (/authentication|invalid x-api-key|401/i.test(raw))
      message = "The LLM API key is invalid. Check ANTHROPIC_API_KEY in web/.env.local.";
    return NextResponse.json({ error: "provider_error", message, raw }, { status: 502 });
  }
}
