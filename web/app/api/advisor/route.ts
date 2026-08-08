import { NextResponse } from "next/server";
import { analyzeIntake, type Intake } from "@/lib/advisor";
import { researchNiche } from "@/lib/research";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const intake = (await req.json()) as Intake;
    const research = await researchNiche(intake); // best-effort live context
    const result = await analyzeIntake(intake, research);

    const email = intake.email?.trim().toLowerCase() || null;

    // Best-effort save — never blocks or fails the response.
    const db = getSupabase();
    if (db) {
      const row = {
        name: intake.name || null,
        socials: intake.socials,
        focus: intake.focus || null,
        questionnaire: intake.q,
        result,
        demo: result.demo ?? false,
      };
      let { error } = await db
        .from("advisor_submissions")
        .insert({ ...row, email });
      // Pre-migration: email column may not exist — retry without it.
      if (error && error.code === "42703") {
        ({ error } = await db.from("advisor_submissions").insert(row));
      }
      if (error) console.error("[advisor] supabase insert failed:", error.message);
    }

    const res = NextResponse.json(result);
    // Set the account cookie so this person's dashboard loads on return.
    if (email) {
      res.cookies.set("pb_email", email, {
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
        sameSite: "lax",
      });
    }
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
