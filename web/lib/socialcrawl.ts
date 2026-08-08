// SocialCrawl client — direct API (not MCP). Docs: https://www.socialcrawl.dev/v1
// Auth: x-api-key header. Universal search /v1/search/everywhere (20 credits).

const BASE = "https://www.socialcrawl.dev/v1";

export interface RawSignal {
  id: string;
  source: string;
  author: string;
  title: string;
  text: string;
  url: string;
  engagement: number;
  freshnessHours: number | null;
  publishedAt: string | null;
  whyRelevant: string | null;
}

interface SearchResult {
  data: { items?: unknown[] } | null;
  items: RawSignal[];
  creditsRemaining: number | null;
}

function engagementTotal(e: unknown): number {
  if (typeof e === "number") return e;
  if (e && typeof e === "object") {
    const o = e as Record<string, number>;
    return (o.likes || 0) + (o.comments || 0) + (o.reposts || 0) + (o.views || 0) / 100;
  }
  return 0;
}

export function normalize(items: unknown[]): RawSignal[] {
  return items
    .map((raw, i) => {
      const it = raw as Record<string, unknown>;
      const si = (Array.isArray(it.source_items) ? it.source_items[0] : {}) as Record<
        string,
        unknown
      >;
      const author = si.author;
      return {
        id: String(it.item_id || it.candidate_id || `sig-${i}`),
        source: String(it.source || si.source || "web"),
        author:
          typeof author === "string"
            ? author
            : ((author as Record<string, string>)?.username ??
              (author as Record<string, string>)?.name ??
              ""),
        title: String(it.title || si.title || ""),
        text: String(si.body || it.snippet || si.snippet || it.title || ""),
        url: String(it.url || si.url || ""),
        engagement: engagementTotal(si.engagement ?? it.engagement),
        freshnessHours: typeof it.freshness === "number" ? it.freshness : null,
        publishedAt: (si.published_at as string) ?? null,
        whyRelevant: (si.why_relevant as string) ?? null,
      };
    })
    .filter((r) => r.text && r.url);
}

export async function searchEverywhere(query: string): Promise<SearchResult> {
  const key = process.env.SOCIALCRAWL_API_KEY;
  if (!key) throw new Error("SOCIALCRAWL_API_KEY is not set");
  const res = await fetch(
    `${BASE}/search/everywhere?query=${encodeURIComponent(query)}`,
    { headers: { "x-api-key": key }, cache: "no-store" },
  );
  const json = (await res.json()) as {
    success: boolean;
    data?: { items?: unknown[] };
    error?: { message?: string };
    credits_remaining?: number;
  };
  if (!json.success) throw new Error(json.error?.message || "SocialCrawl request failed");
  return {
    data: json.data ?? null,
    items: normalize(json.data?.items ?? []),
    creditsRemaining: json.credits_remaining ?? null,
  };
}
