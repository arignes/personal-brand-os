// Claude provider — official Anthropic SDK. Default model claude-opus-4-8,
// adaptive thinking on generative roles, structured output via output_config.format.
import Anthropic from "@anthropic-ai/sdk";
import type { LLMRequest, LLMResult } from "./types";

let client: Anthropic | null = null;

// Accept either name so ANTHROPIC_API_KEY or CLAUDE_API_KEY works.
function claudeKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;
}

export function claudeAvailable(): boolean {
  return !!claudeKey();
}

function getClient(): Anthropic {
  const apiKey = claudeKey();
  if (!apiKey) throw new Error("No Claude key set (ANTHROPIC_API_KEY or CLAUDE_API_KEY)");
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

export async function callClaude(
  req: LLMRequest,
  model: string,
  thinking: boolean,
): Promise<LLMResult> {
  const c = getClient();

  // Built as a loose object so we can attach output_config / thinking without
  // fighting the SDK's param union; the SDK validates at the wire.
  const params: Record<string, unknown> = {
    model,
    max_tokens: req.maxTokens ?? (thinking ? 4096 : 1024),
    system: req.system,
    messages: [{ role: "user", content: req.user }],
  };
  if (thinking) params.thinking = { type: "adaptive" };
  if (req.schema) {
    params.output_config = { format: { type: "json_schema", schema: req.schema } };
  }

  const res = await c.messages.create(
    params as unknown as Anthropic.MessageCreateParamsNonStreaming,
  );

  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return { text, provider: "claude", model };
}
