import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// PATCH { result } — save edits to the current user's brand (their latest row).
export async function PATCH(req: Request) {
  const { result } = (await req.json()) as { result?: unknown };
  if (!result) {
    return NextResponse.json({ error: "result is required" }, { status: 400 });
  }
  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ error: "database not configured" }, { status: 503 });
  }

  const email = (await cookies()).get("pb_email")?.value;

  // Target the same row getActiveBrand shows: latest for this email, else latest.
  let query = db
    .from("advisor_submissions")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1);
  if (email) query = query.eq("email", email);

  const { data, error } = await query.maybeSingle();
  if (error || !data) {
    return NextResponse.json({ error: "no brand to update" }, { status: 404 });
  }

  const { error: upErr } = await db
    .from("advisor_submissions")
    .update({ result })
    .eq("id", data.id);
  if (upErr) {
    return NextResponse.json({ error: upErr.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
