// The "active brand" = the most recent Advisor submission. All dashboard pages
// (Today, Brand, Calendar, Contacts) read from it, so the whole app reflects
// whoever just went through the Advisor. Single-user demo model.
import "server-only";
import { cookies } from "next/headers";
import type { AdvisorResult, Intake } from "./advisor";
import { getSupabase } from "./supabase";

export interface ActiveBrand {
  name: string;
  intake: Intake;
  result: AdvisorResult;
  createdAt: string;
}

const COLS = "name, socials, focus, questionnaire, result, created_at";

export async function getActiveBrand(): Promise<ActiveBrand | null> {
  const db = getSupabase();
  if (!db) return null;

  const email = (await cookies()).get("pb_email")?.value;

  // Signed in (cookie present): load THIS person's latest brand.
  if (email) {
    const { data, error } = await db
      .from("advisor_submissions")
      .select(COLS)
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    // If the email column doesn't exist yet (pre-migration), fall back to latest.
    if (error && error.code !== "42703") return null;
    if (!error) return data && data.result ? shape(data) : null;
  } else {
    // No cookie = not signed up. Only fall through to "latest" pre-migration
    // (single-brand demo). Once email accounts exist this returns null → Advisor.
    if (await emailColumnExists(db)) return null;
  }

  const { data } = await db
    .from("advisor_submissions")
    .select(COLS)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data && data.result ? shape(data) : null;
}

async function emailColumnExists(db: ReturnType<typeof getSupabase>): Promise<boolean> {
  if (!db) return false;
  const { error } = await db.from("advisor_submissions").select("email").limit(1);
  return !(error && error.code === "42703");
}

function shape(data: {
  name: string | null;
  socials: unknown;
  focus: string | null;
  questionnaire: unknown;
  result: unknown;
  created_at: string;
}): ActiveBrand {
  return {
    name: data.name ?? "",
    intake: {
      name: data.name ?? "",
      socials: data.socials ?? {},
      focus: data.focus ?? "",
      q: data.questionnaire ?? {},
    } as Intake,
    result: data.result as AdvisorResult,
    createdAt: data.created_at,
  };
}
