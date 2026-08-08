import { NextResponse } from "next/server";
import { claudeAvailable, geminiAvailable, nousAvailable, resolveRole } from "@/lib/llm";
import type { AgentRole } from "@/lib/llm";
import { perplexityAvailable } from "@/lib/research";

export const dynamic = "force-dynamic";

const ROLES: AgentRole[] = ["scorer", "drafter", "voice_check", "contact", "digest"];

// GET /api/llm-status — verify adapter wiring + per-role provider resolution
// without spending any tokens (reports config + which providers have keys).
export async function GET() {
  const providers = {
    claude: claudeAvailable(),
    gemini: geminiAvailable(),
    nous: nousAvailable(),
    perplexity_research: perplexityAvailable(),
  };
  const roles = Object.fromEntries(
    ROLES.map((r) => {
      const cfg = resolveRole(r);
      return [r, { provider: cfg.provider, model: cfg.model, thinking: cfg.thinking }];
    }),
  );
  return NextResponse.json({ providers, roles });
}
