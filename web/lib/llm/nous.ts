// Nous provider — Nous Portal is OpenAI-compatible (chat/completions). Base URL
// and model slug are env-configurable since Portal exposes 300+ models.
//   NOUS_PORTAL_API_KEY, NOUS_PORTAL_BASE_URL (default below), LLM_MODEL_<ROLE>
// NOTE: verify the exact base URL + model slug against your Nous Portal account.
import type { LLMRequest, LLMResult } from "./types";

const DEFAULT_BASE = "https://inference-api.nousresearch.com/v1";

export function nousAvailable(): boolean {
  return !!process.env.NOUS_PORTAL_API_KEY;
}

export async function callNous(req: LLMRequest, model: string): Promise<LLMResult> {
  const key = process.env.NOUS_PORTAL_API_KEY;
  if (!key) throw new Error("NOUS_PORTAL_API_KEY is not set");
  const base = process.env.NOUS_PORTAL_BASE_URL || DEFAULT_BASE;

  const body: Record<string, unknown> = {
    model,
    max_tokens: req.maxTokens ?? 1024,
    messages: [
      { role: "system", content: req.system },
      { role: "user", content: req.user },
    ],
  };
  if (req.schema) {
    body.response_format = {
      type: "json_schema",
      json_schema: { name: "result", schema: req.schema },
    };
  }

  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Nous request failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = (json.choices?.[0]?.message?.content ?? "").trim();
  return { text, provider: "nous", model };
}
