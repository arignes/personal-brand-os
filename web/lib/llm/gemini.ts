// Gemini provider — Google Generative Language REST API. Model env-configurable
// via LLM_MODEL_<ROLE>; default gemini-2.0-flash.
import type { LLMRequest, LLMResult } from "./types";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export function geminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function callGemini(req: LLMRequest, model: string): Promise<LLMResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");

  // Gemini has no separate schema field on REST that maps 1:1 to JSON Schema;
  // ask for JSON and hand it the schema in the prompt when one is provided.
  const userText = req.schema
    ? `${req.user}\n\nRespond with a single JSON object matching this schema:\n${JSON.stringify(req.schema)}`
    : req.user;

  const body = {
    systemInstruction: { parts: [{ text: req.system }] },
    contents: [{ role: "user", parts: [{ text: userText }] }],
    generationConfig: {
      maxOutputTokens: req.maxTokens ?? 2048,
      ...(req.schema ? { responseMimeType: "application/json" } : {}),
    },
  };

  const res = await fetch(`${BASE}/${model}:generateContent?key=${key}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);

  const json = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = (json.candidates?.[0]?.content?.parts ?? [])
    .map((p) => p.text ?? "")
    .join("")
    .trim();
  return { text, provider: "gemini", model };
}
