// Regenerate one social post in the person's voice, grounded in the frameworks.
import { anyProviderConfigured, callLLM } from "@/lib/llm";
import { MARKETING_PLAYBOOK } from "@/lib/marketing-playbook";

export interface Post {
  channel: string;
  hook: string;
  body: string;
  why: string;
}

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    channel: { type: "string" },
    hook: { type: "string" },
    body: { type: "string" },
    why: { type: "string" },
  },
  required: ["channel", "hook", "body", "why"],
} as const;

const SYSTEM = `You are a direct-response copywriter.

${MARKETING_PLAYBOOK}

Write ONE social post in the person's tone: a scroll-stopping first line, one idea, a short body, no em-dashes, no hard sell. End on a clear thought or open question. Include "why": 1-2 sentences on what makes it work and which named framework it uses.`;

export async function regeneratePost(
  topic: string,
  tone: string,
  channel: string,
): Promise<Post | null> {
  if (!anyProviderConfigured()) return null;
  try {
    const res = await callLLM({
      role: "drafter",
      system: SYSTEM,
      user: `Channel: ${channel}\nTone: ${tone || "clear and useful"}\nTopic: ${topic}\n\nWrite a fresh take on this, different from the obvious angle.`,
      schema: SCHEMA as unknown as Record<string, unknown>,
      maxTokens: 700,
    });
    return JSON.parse(res.text) as Post;
  } catch {
    return null;
  }
}
