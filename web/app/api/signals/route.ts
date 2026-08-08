import { NextResponse } from "next/server";
import { getStoredSignals, refreshSignals } from "@/lib/signals";

export const dynamic = "force-dynamic";

// GET /api/signals          → scored signals from the cached seed (no credits)
// GET /api/signals?refresh=1 → live SocialCrawl search (spends 20 credits)
export async function GET(req: Request) {
  const refresh = new URL(req.url).searchParams.get("refresh") === "1";
  try {
    if (refresh) {
      const { signals, creditsRemaining } = await refreshSignals();
      return NextResponse.json({ source: "live", creditsRemaining, signals });
    }
    const signals = await getStoredSignals();
    return NextResponse.json({ source: "seed", signals });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message, signals: [] }, { status: 500 });
  }
}
