// Perplexity research — live, web-grounded context about a person's niche and
// audience, fed into the Advisor analysis so the plan reflects what's current.
// OpenAI-compatible API at api.perplexity.ai (model "sonar").
import "server-only";
import type { Intake } from "./advisor";

export function perplexityAvailable(): boolean {
  return !!process.env.PERPLEXITY_API_KEY;
}

export async function researchNiche(i: Intake): Promise<string | null> {
  const key = process.env.PERPLEXITY_API_KEY;
  if (!key) return null;

  const topic = [i.focus, i.q.identity, i.q.audience, i.q.pillars]
    .filter(Boolean)
    .join(" · ");
  if (!topic) return null;

  const model = process.env.PERPLEXITY_MODEL || "sonar";
  try {
    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      cache: "no-store",
      body: JSON.stringify({
        model,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content:
              "You are a research assistant. Give a concise, current briefing (5-6 bullet points) on the audience, live conversations, and recent shifts relevant to the topic. Be specific and factual; no fluff.",
          },
          {
            role: "user",
            content: `Topic: ${topic}\n\nWhat does this audience care about right now, what are they talking about, and what has recently changed?`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return json.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null; // research is best-effort; never block the analysis
  }
}
