// Heuristic scorer — free, no AI. Phase 1 of the two-phase pipeline (see
// pipeline/01-signals.md). Claude scoring layers on top when the key is wired.

import { LANE_MINE, LANE_NEVER, PILLARS, SIGNAL_KEYWORDS } from "./brand-config";
import type { RawSignal } from "./socialcrawl";

export interface ScoredSignal extends RawSignal {
  score: number; // 0-5
  lane: "mine" | "adjacent" | "never";
  action: "REPLY" | "CONTENT" | "CONTACT";
  pillar: string;
  reasons: string[];
}

const hits = (text: string, kws: string[]) => kws.filter((k) => text.includes(k));

const CONTENT_SOURCES = ["hackernews", "tavily", "perplexity", "github", "youtube"];

export function scoreSignal(s: RawSignal): ScoredSignal {
  const t = `${s.title} ${s.text}`.toLowerCase();
  const kwHits = hits(t, SIGNAL_KEYWORDS);
  const neverHits = hits(t, LANE_NEVER);
  const mineHits = hits(t, LANE_MINE);

  let score = Math.min(5, kwHits.length * 0.8);
  if (s.engagement > 200) score += 0.6;
  else if (s.engagement > 50) score += 0.3;
  if (s.freshnessHours !== null && s.freshnessHours <= 48) score += 0.4;
  score = Math.min(5, Math.round(score * 10) / 10);

  let lane: ScoredSignal["lane"] = "adjacent";
  if (neverHits.length) lane = "never";
  else if (mineHits.length >= 1) lane = "mine";

  let pillar = PILLARS[0].name;
  let best = 0;
  for (const p of PILLARS) {
    const h = hits(t, p.kws).length;
    if (h > best) {
      best = h;
      pillar = p.name;
    }
  }

  let action: ScoredSignal["action"] = "REPLY";
  if (CONTENT_SOURCES.includes(s.source)) action = "CONTENT";
  if (/looking for|anyone know|recommend|how do you|what's the best|advice/.test(t))
    action = "CONTACT";

  const reasons: string[] = [];
  if (kwHits.length) reasons.push(`matches ${kwHits.slice(0, 3).join(", ")}`);
  if (s.engagement > 50) reasons.push(`${Math.round(s.engagement)} engagement`);
  if (s.freshnessHours !== null) reasons.push(`${s.freshnessHours}h old`);

  return { ...s, score, lane, action, pillar, reasons };
}

export function scoreAndRank(items: RawSignal[], min = 1.5): ScoredSignal[] {
  return items
    .map(scoreSignal)
    .filter((s) => s.lane !== "never" && s.score >= min)
    .sort((a, b) => b.score - a.score);
}
