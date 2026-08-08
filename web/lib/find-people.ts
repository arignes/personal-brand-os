// Find real people to reach for a niche, via SocialCrawl universal search.
// LinkedIn has no people-search endpoint (only profile-by-URL), so we run the
// universal search and surface its LinkedIn hits first, then other socials.
import "server-only";
import { searchEverywhere } from "./socialcrawl";

export interface Person {
  name: string;
  source: string;
  url: string;
  snippet: string;
}

type RawItem = {
  source?: string;
  title?: string;
  snippet?: string;
  url?: string;
  source_items?: { author?: unknown; url?: string; snippet?: string }[];
};

// Does a result belong to one of the platforms the person actually gave?
function sourceOf(it: RawItem, url: string): string {
  if (url.includes("linkedin.com")) return "linkedin";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("twitter.com") || url.includes("x.com")) return "x";
  return it.source || "web";
}

function allowed(source: string, platforms: Set<string>): boolean {
  // No platforms given → fall back to the common socials.
  if (platforms.size === 0) return ["linkedin", "instagram", "x"].includes(source);
  if (platforms.has("linkedin") && source === "linkedin") return true;
  if (platforms.has("instagram") && source === "instagram") return true;
  if ((platforms.has("x") || platforms.has("twitter")) && source === "x") return true;
  return false;
}

export async function findPeople(
  query: string,
  platforms: string[] = [],
): Promise<{ people: Person[]; creditsRemaining: number | null }> {
  const { data, creditsRemaining } = await searchEverywhere(query);
  const items = ((data?.items ?? []) as RawItem[]) || [];
  const allow = new Set(platforms.map((p) => p.toLowerCase()));
  const people: Person[] = [];
  const seen = new Set<string>();

  // LinkedIn first (when allowed), then the other allowed platforms.
  const order = ["linkedin", "instagram", "x"];
  for (const wantSource of order) {
    for (const it of items) {
      const si = it.source_items?.[0] ?? {};
      const author =
        typeof si.author === "string"
          ? si.author
          : ((si.author as Record<string, string>)?.name ?? "");
      const url = it.url || si.url || "";
      if (!author || !url) continue;
      const source = sourceOf(it, url);
      if (source !== wantSource) continue;
      if (!allowed(source, allow)) continue;
      const key = author.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      people.push({
        name: author,
        source,
        url,
        snippet: (it.title || it.snippet || si.snippet || "").slice(0, 140),
      });
    }
  }

  return { people: people.slice(0, 5), creditsRemaining };
}
