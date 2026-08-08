import { NextResponse } from "next/server";
import { findPeople } from "@/lib/find-people";

export const dynamic = "force-dynamic";

// POST { query } → real people to reach (SocialCrawl universal search, ~20 credits)
export async function POST(req: Request) {
  if (!process.env.SOCIALCRAWL_API_KEY) {
    return NextResponse.json(
      { error: "no_key", message: "SOCIALCRAWL_API_KEY is not set." },
      { status: 503 },
    );
  }
  try {
    const { query, platforms } = (await req.json()) as {
      query?: string;
      platforms?: string[];
    };
    if (!query?.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }
    const { people, creditsRemaining } = await findPeople(
      query.trim(),
      Array.isArray(platforms) ? platforms : [],
    );
    return NextResponse.json({ people, creditsRemaining });
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
