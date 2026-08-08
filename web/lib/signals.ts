// Server-only: loads scored signals from the cached seed, or refreshes live
// from SocialCrawl. The Today page calls getStoredSignals() directly (no HTTP).

import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { scoreAndRank, type ScoredSignal } from "./scoring";
import { normalize, searchEverywhere } from "./socialcrawl";

const SEED = path.join(process.cwd(), "data", "signals-seed.json");

// Queries that define Arina's listening universe (from brand/messaging.md).
export const SEARCH_QUERIES = [
  "AI marketing agents",
  "Web3 go-to-market",
  "marketer building tools",
];

export async function getStoredSignals(limit = 12): Promise<ScoredSignal[]> {
  try {
    const file = JSON.parse(await fs.readFile(SEED, "utf8"));
    const items = normalize(file?.data?.items ?? []);
    return scoreAndRank(items).slice(0, limit);
  } catch {
    return [];
  }
}

export async function refreshSignals(
  query = SEARCH_QUERIES[0],
): Promise<{ signals: ScoredSignal[]; creditsRemaining: number | null }> {
  const { data, items, creditsRemaining } = await searchEverywhere(query);
  try {
    await fs.writeFile(SEED, JSON.stringify({ data }), "utf8");
  } catch {
    // serverless filesystem is read-only; persistence moves to Supabase later
  }
  return { signals: scoreAndRank(items).slice(0, 12), creditsRemaining };
}
